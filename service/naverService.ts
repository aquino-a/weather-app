import { HTMLElement, parse } from 'node-html-parser';

import { Location } from './locationService';
import {
    HumidityForecast,
    RainForecast,
    Scale,
    Temperature,
    Weather,
    WeatherForecast,
    WeatherSource,
    WindForecast,
    WeeklyForecast,
    WeatherService,
} from './weatherService';

const NAVER_BASE_URL: string = 'weather.naver.com';
const TEMPERATURE_REGEX: RegExp = new RegExp('(\\d+)(?:°|도)');
const PERCENT_REGEX: RegExp = new RegExp('(\\d+)%');
const SPEED_REGEX: RegExp = new RegExp('(\\d+) *m/s');
const RAIN_REGEX: RegExp = new RegExp('(\\d+(?:\\.\\d+)?) *mm');
const COOKIE_REGEX: RegExp = new RegExp('[A-Z\\d_]+="?[A-Za-z\\d]*=?"?', 'g');
const HIDDEN_DATA_REGEX: RegExp = new RegExp(
    'var hourlyFcastListJson = (\\[[^]+\\]);',
    'gm'
);

const HIDDEN_CURRENT_DATA_REGEX: RegExp = new RegExp(
    'var weatherSummary = ([^]+}});',
    'gm'
);

// const NEW_LINE_REGEX: RegExp = new RegExp('\\r?\\n|\\r', 'gm');

const DATE_REGEX: RegExp = new RegExp('(\\d+)\\.(\\d+)');

var cookie: string;

/**
 * Searchs the naver api for the location name and location code using a text query.
 *
 * @param {string} query the location to search for by name.
 * @return {*}  {Promise<location[]>}
 * @memberof naverService
 */
export const searchLocation = async (query: string): Promise<Location[]> => {
    const url = new URL(`https://ac.${NAVER_BASE_URL}/ac`);
    url.searchParams.append('q_enc', 'utf-8');
    url.searchParams.append('r_format', 'json');
    url.searchParams.append('r_enc', 'utf-8');
    url.searchParams.append('r_lt', '1');
    url.searchParams.append('st', '1');
    url.searchParams.append('q', query);

    const response = await fetch(url);
    const result = await response.json();

    return parseLocations(result);
};

/**
 * Parses the object returned by the naver location api.
 *
 * @param {*} rawObject the object containing the results.
 * @memberof naverService
 */
const parseLocations = (rawObject: any): Location[] => {
    if (
        rawObject === undefined ||
        rawObject === null ||
        rawObject.items === undefined ||
        rawObject.items === null ||
        rawObject.items.length === 0
    ) {
        return [];
    }

    return rawObject.items[0].map((a: string[][]) => ({
        name: a[0][0],
        code: a[1][0],
    }));
};

/**
 * Searchs for the weather based on the location code.
 *
 * @param {string} locationCode the code of the location to search for.
 * @return {*}  {Promise<weather>}
 * @memberof naverService
 */
export const searchWeather = async (locationCode: string): Promise<Weather> => {
    const url = new URL(
        `https://${NAVER_BASE_URL}/today/${locationCode}?cpName=ACCUWEATHER`
    );

    const response = await fetch(url, {
        headers: {
            cookie: cookie,
        },
    });

    const setCookie = response.headers.get('set-cookie')!;
    const matches = setCookie.match(COOKIE_REGEX);
    cookie = matches?.join('; ')!;

    const rawHtml = await response.text();
    const weatherDoc = parse(rawHtml);

    return parseWeather(weatherDoc);
};

/**
 * Set the source type for weather data.
 * Sends post request to naver with the weather source type.
 *
 * @param {WeatherSource} source
 * @return {*}  {Promise<void>}
 * @memberof naverService
 */
const setWeatherSource = async (
    locationCode: string,
    source: WeatherSource
): Promise<void> => {
    const url = new URL(`https://${NAVER_BASE_URL}/today/api/follow`);
    const data = {
        regionCode: locationCode,
        cpName: source.toString(),
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            cookie: cookie,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: JSON.stringify(data),
    });

    console.log(response.status);
};

/**
 * Parse the weather from a naver weather page.
 *
 * @static
 * @param {Document} weatherDoc the naver weather web page.
 * @return {*}  {(weather)} the weather data from the web page.
 * @memberof naverService
 */
const parseWeather = (weatherDoc: HTMLElement): Weather => {
    // weather_area
    const weatherArea = weatherDoc.querySelector(
        '.weather_area'
    ) as HTMLElement;

    const currentTemperature = parseTemperature(weatherArea);
    const hiddenCurrent = parseHiddenCurrent(weatherDoc);
    const currentCondition = weatherArea.querySelector('.weather')!
        .textContent as string;
    const rainAmount = parseRain(weatherArea);
    const dust = parseHiddenDust(weatherDoc);

    //forecasts
    const hiddenForecasts = parseHiddenForecasts(weatherDoc);
    const weatherForecasts = hiddenForecasts.weatherForecasts;
    const rainForecasts = hiddenForecasts.rainForecasts;
    const humidityForecasts = hiddenForecasts.humidityForecasts;
    const windForecasts = hiddenForecasts.windForecasts;

    const weeklyForecast = parseWeeklyForecast(weatherDoc);

    return {
        temperature: currentTemperature,
        humidity: hiddenCurrent.humd,
        windSpeed: hiddenCurrent.windSpd,
        windDirection: hiddenCurrent.windDrctnName,
        feel: { degrees: hiddenCurrent.stmpr, type: Scale.C },
        dust: dust.stationPM10Legend1,
        microDust: dust.stationPM25Legend1,
        condition: currentCondition,
        rainAmount: rainAmount,
        rainForecasts: rainForecasts,
        humidityForecasts: humidityForecasts,
        windForecasts: windForecasts,
        weatherForecasts: weatherForecasts,
        weeklyForecast: weeklyForecast,
    };
};

/**
 * Parses the temperature from the weather area section.
 *
 * @private
 * @static
 * @param {Element} weatherArea
 * @return {*}  {temperature}
 * @memberof naverService
 */
const parseTemperature = (weatherArea: HTMLElement): Temperature => {
    const line = weatherArea.querySelector('.current')!.textContent;

    return {
        degrees: Number(TEMPERATURE_REGEX.exec(line)[1]),
        type: Scale.C,
    };
};

/**
 * Retrieves the hidden json data containing the current weather from the main weather page.
 *
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {HiddenForecast}
 * @memberof naverService
 */
const parseHiddenCurrent = (weatherDoc: HTMLElement): HiddenForecast => {
    const weatherSummary = findWeatherSummary(weatherDoc);
    return weatherSummary.nowFcast as HiddenForecast;
};

/**
 * Parses the details of the summary list in the weather area.
 *
 * @private
 * @static
 * @param {Element} weatherArea
 * @return {*}  {*}
 * @memberof naverService
 */
const parseListDetails = (weatherArea: HTMLElement): any => {
    const list = weatherArea
        .querySelector('.summary_list')!
        .childNodes.filter(n => n instanceof HTMLElement);

    const start = list.findIndex(n => n.textContent === '습도'); //-1 or the index

    return {
        humidity: Number(PERCENT_REGEX.exec(list[start + 1].textContent)[1]),
        windDirection: list[start + 2].textContent,
        windSpeed: Number(SPEED_REGEX.exec(list[start + 3].textContent)[1]),
        feel: {
            degrees: Number(
                TEMPERATURE_REGEX.exec(list[start + 5].textContent)[1]
            ),
            type: Scale.C,
        },
    };
};

/**
 * Parse the rain details from the weather area.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherArea
 * @return {*}  {number}
 * @memberof naverService
 */
const parseRain = (weatherArea: HTMLElement): number => {
    const rainArea = weatherArea.querySelector('.summary_rainfall');

    if (rainArea === undefined || rainArea === null) {
        return 0;
    }

    const rainAmount = rainArea.querySelector('strong').textContent;

    return Number(RAIN_REGEX.exec(rainAmount)[1]);
};

/**
 * Parses the hidden air data in the main weather page.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {HiddenAirForecast}
 * @memberof naverService
 */
const parseHiddenDust = (weatherDoc: HTMLElement): HiddenAirForecast => {
    const weatherSummary = findWeatherSummary(weatherDoc);
    return weatherSummary.airFcast as HiddenAirForecast;
};

/**
 * Finds and parses the hidden weather summary data from the main weather page.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {*}
 * @memberof naverService
 */
const findWeatherSummary = (weatherDoc: HTMLElement): any => {
    const scripts = weatherDoc.querySelectorAll('script');
    const lastScriptText = scripts[scripts.length - 1].textContent.replace(
        /[\n\r]/g,
        ''
    );

    try {
        HIDDEN_CURRENT_DATA_REGEX.lastIndex = 0;
        return JSON.parse(HIDDEN_CURRENT_DATA_REGEX.exec(lastScriptText)![1]);
    } catch (error) {
        console.log(`last script: ${lastScriptText}`);
        console.log(error);
        throw error;
    }
};

/**
 * Parse the dust details from the main weather document.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {*}
 * @memberof naverService
 */
const parseDust = (weatherDoc: HTMLElement): any => {
    const list = weatherDoc
        .querySelector('.today_chart_list')
        .querySelectorAll('.level_text');

    return {
        dust: list[0].textContent,
        microDust: list[1].textContent,
    };
};

/**
 * Parse the weather forecasts from the main weather page.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {weatherForecast[]}
 * @memberof naverService
 */
const parseWeatherForecasts = (weatherDoc: HTMLElement): WeatherForecast[] => {
    return weatherDoc
        .querySelector('.time_list.align_left')
        .childNodes.filter(n => n instanceof HTMLElement)
        .map(n => n as HTMLElement)
        .map((e: HTMLElement): WeatherForecast => {
            const degrees = Number(e.getAttribute('data-tmpr'));
            const condition = e.getAttribute('data-wetr-txt') as string;

            const dateTime = e.getAttribute('data-ymdt') as string;
            const time = parseTime(dateTime);

            return {
                temperature: { degrees: degrees, type: Scale.C },
                condition: condition,
                time: time,
            };
        });
};

/**
 * Finds the hidden weather data js object in the web page
 * and parses the data.
 *
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {{
 *         rainForecasts: rainForecast[],
 *         humidityForecasts: humidityForecast[],
 *         windForecasts: windForecast[]
 *     }}
 * @memberof naverService
 */
const parseHiddenForecasts = (
    weatherDoc: HTMLElement
): {
    rainForecasts: RainForecast[];
    humidityForecasts: HumidityForecast[];
    windForecasts: WindForecast[];
    weatherForecasts: WeatherForecast[];
} => {
    const scripts = weatherDoc.querySelectorAll('script');
    const lastScriptText = scripts[scripts.length - 1].textContent;

    let data;
    try {
        HIDDEN_DATA_REGEX.lastIndex = 0;
        data = JSON.parse(
            HIDDEN_DATA_REGEX.exec(lastScriptText)![1]
        ) as HiddenForecast[];
    } catch (error) {
        console.log(`last script: ${lastScriptText}`);
        console.log(error);
        return {
            rainForecasts: [],
            humidityForecasts: [],
            windForecasts: [],
            weatherForecasts: [],
        };
    }

    return {
        rainForecasts: data.map(hf => {
            let rainAmount = hf.rainAmt;
            if (rainAmount.lastIndexOf('~') >= 0) {
                const index = rainAmount.lastIndexOf('~') + 1;
                rainAmount = rainAmount.substr(index);
            }

            return {
                amount: Number(rainAmount),
                percentChance: Number(hf.rainProb),
                time: parseTime(hf.aplYmdt),
            };
        }),
        humidityForecasts: data.map(hf => ({
            humidity: Number(hf.humd),
            time: parseTime(hf.aplYmdt),
        })),
        windForecasts: data.map(hf => ({
            direction: hf.windDrctnName,
            speed: Number(hf.windSpd),
            time: parseTime(hf.aplYmdt),
        })),
        weatherForecasts: data.map(hf => ({
            condition: hf.wetrTxt,
            temperature: {
                degrees: hf.tmpr,
                type: Scale.C,
            },
            time: parseTime(hf.aplYmdt),
        })),
    };
};

/**
 * Parse the rain forecasts from the main weather page.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {rainForecast[]}
 * @memberof naverService
 */
const parseRainForecasts = (weatherDoc: HTMLElement): RainForecast[] => {
    const rainSection = weatherDoc.querySelector(
        'div[data-nclk="wtk.rainhrscr"]'
    );

    const percentages = rainSection
        ?.querySelector('tr.row_icon')
        ?.querySelectorAll('td.data');

    const amounts = rainSection
        ?.querySelector('tr.row_graph.row_rain')
        ?.querySelectorAll('td.data');

    if (
        percentages === undefined ||
        amounts === undefined ||
        percentages.length !== amounts.length
    ) {
        return [];
    }

    const rainForecasts: RainForecast[] = [];
    for (let i = 0; i < percentages.length; i++) {
        const percentage = percentages[i];
        const amount = amounts[i];

        rainForecasts.push({
            percentChance: Number(
                percentage.querySelector('em.value')?.textContent
            ),
            amount: Number(amount.querySelector('div.data_inner')?.textContent),
            time: parseTime(percentage.getAttribute('data-ymdt') as string),
        });
    }

    return rainForecasts;
};

/**
 * Parse the humidity forecasts from the main weather page.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {humidityForecast[]}
 * @memberof naverService
 */
const parseHumidityForecasts = (
    weatherDoc: HTMLElement
): HumidityForecast[] => {
    const humiditySection = weatherDoc.querySelector(
        'div[data-nclk="wtk.humihrscr"]'
    );

    const humidities = humiditySection?.querySelectorAll('td.data');

    if (humidities === undefined) {
        return [];
    }

    return Array.from(humidities).map(
        (e: Element): HumidityForecast => ({
            humidity: Number(e.querySelector('span.num')?.textContent),
            time: parseTime(e.getAttribute('data-ymdt') as string),
        })
    );
};

/**
 * Parse the wind forecasts from the main weather page.
 *
 * @private
 * @static
 * @param {Document} weatherDoc
 * @return {*}  {windForecast[]}
 * @memberof naverService
 */
const parseWindForecasts = (weatherDoc: HTMLElement): WindForecast[] => {
    const windSection = weatherDoc.querySelector(
        'div[data-nclk="wtk.windhrscr"]'
    );

    const directions = windSection
        ?.querySelector('tr.row_icon')
        ?.querySelectorAll('td.data');

    const speeds = windSection
        ?.querySelector('tr.row_graph')
        ?.querySelectorAll('td.data');

    if (
        directions === undefined ||
        speeds === undefined ||
        directions.length !== speeds.length
    ) {
        return [];
    }

    const windForecasts: WindForecast[] = [];
    for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        const speed = speeds[i];

        windForecasts.push({
            direction: direction.querySelector('span.value')
                ?.textContent as string,
            speed: Number(speed.querySelector('span.num')?.textContent),
            time: parseTime(speed.getAttribute('data-ymdt') as string),
        });
    }

    return windForecasts;
};

/**
 * Parse a date from a date time string in the main weather page.
 *
 * @private
 * @static
 * @param {string} dateTime
 * @return {*}  {Date}
 * @memberof naverService
 */
const parseTime = (dateTime: string): Date => {
    return new Date(
        Number(dateTime.substr(0, 4)),
        Number(dateTime.substr(4, 2)) - 1,
        Number(dateTime.substr(6, 2)),
        Number(dateTime.substr(8, 2)),
        0,
        0,
        0
    );
};

/**
 * Parses the weekly forecast from the main weather page.
 *
 * @private
 * @static
 * @param {HTMLElement} weatherDoc
 * @return {*}  {WeeklyForecast[]}
 * @memberof NaverService
 */
const parseWeeklyForecast = (weatherDoc: HTMLElement): WeeklyForecast[] => {
    const weekItems = weatherDoc
        .querySelector('.week_list')
        ?.querySelectorAll('.week_item');

    const today = new Date();

    return weekItems.map((h: HTMLElement) => {
        const dateResult = DATE_REGEX.exec(
            h.querySelector('.date')!.textContent
        )!;

        const day = new Date(
            today.getFullYear(),
            +dateResult[1] - 1,
            +dateResult[2]
        );

        const weatherInners = h
            .querySelectorAll('.weather_inner')
            .map(parseWeatherInner);

        return {
            morning: {
                time: day,
                condition: weatherInners[0].condition,
                rainChance: weatherInners[0].rainChance,
                temperature: {
                    degrees: +TEMPERATURE_REGEX.exec(
                        h.querySelector('.temperature').querySelector('.lowest')
                            .textContent
                    )![1],
                    type: Scale.C,
                },
            },
            afternoon: {
                time: day,
                condition: weatherInners[1].condition,
                rainChance: weatherInners[1].rainChance,
                temperature: {
                    degrees: +TEMPERATURE_REGEX.exec(
                        h
                            .querySelector('.temperature')
                            .querySelector('.highest').textContent
                    )![1],
                    type: Scale.C,
                },
            },
        };
    });
};

/**
 * Parse the data from the "weather_inner" node.
 *
 * @private
 * @static
 * @param {HTMLElement} inner
 * @return {*}  {{
 *         condition: string;
 *         rainChance: number;
 *     }}
 * @memberof NaverService
 */
const parseWeatherInner = (
    inner: HTMLElement
): {
    condition: string;
    rainChance: number;
} => {
    return {
        condition: inner.attributes['data-wetr-txt'],
        rainChance: +PERCENT_REGEX.exec(
            inner.querySelector('.rainfall').textContent
        )![1],
    };
};

/**
 * The interface for the hidden weather data in the web page.
 *
 * @interface HiddenForecast
 */
interface HiddenForecast {
    aplYmdt: string;
    rainProb: number;
    rainAmt: string;
    humd: number;
    windDrctn: string;
    windDrctnName: string;
    windSpd: number;
    tmpr: number;
    stmpr: number;
    wetrTxt: string;
}

/**
 * The interface for the hidden air forecast data.
 *
 * @interface HiddenAirForecast
 */
interface HiddenAirForecast {
    stationPM10: number;
    stationPM10Legend1: string;
    stationPM25: number;
    stationPM25Legend1: string;
}

const naverServiceInstance: WeatherService = {
    searchWeather: searchWeather,
    setWeatherSource: setWeatherSource,
};

export default naverServiceInstance;
