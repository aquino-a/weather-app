import { HTMLElement, parse } from 'node-html-parser';

import { Location, LocationService } from './locationService';
import {
    Scale,
    Weather,
    WeatherSource,
    Forecast,
    WeeklyForecast,
    WeatherService,
} from './weatherService';

const NAVER_BASE_URL: string = 'weather.naver.com';

const TEMPERATURE_REGEX: RegExp = /(\d+)(?:°|도)/;
const PERCENT_REGEX: RegExp = /(\d+)%/;
const RAIN_REGEX: RegExp = /(\d+(?:\.\d+)?) *mm/;
const COOKIE_REGEX: RegExp = /[A-Z\d_]+="?[A-Za-z\d]*=?"?/g;
const HIDDEN_DATA_REGEX: RegExp = /var hourlyFcastListJson = (\[[^]+\]);/gm;
const HIDDEN_CURRENT_DATA_REGEX: RegExp = /var weatherSummary = ([^]+}})/;
const DATE_REGEX: RegExp = /(\d+)\.(\d+)/;
const DATE_TIME_REGEX: RegExp = /(\d{4})(\d{2})(\d{2})(\d{2})/;

let cookie: string;

/**
 * Searchs the naver api for the location name and location code using a text query.
 *
 * @param {string} query the location to search for by name.
 * @return {*}  {Promise<location[]>}
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
 * @return {*}  {Promise<Weather>}
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
 * @param {Document} weatherDoc the naver weather web page.
 * @return {*}  {(weather)} the weather data from the web page.

 */
const parseWeather = (weatherDoc: HTMLElement): Weather => {
    // weather_area
    const weatherArea = weatherDoc.querySelector(
        '.weather_area'
    ) as HTMLElement;

    const hiddenCurrent = parseHiddenCurrent(weatherDoc);
    const currentCondition = weatherArea.querySelector('.weather')!
        .textContent as string;
    const rainAmount = parseRain(weatherArea);
    const dust = parseHiddenDust(weatherDoc);

    //forecasts
    const hiddenForecasts = parseHiddenForecasts(weatherDoc);

    const weeklyForecast = parseWeeklyForecast(weatherDoc);

    return {
        temperature: { degrees: hiddenCurrent.tmpr, type: Scale.C },
        humidity: hiddenCurrent.humd,
        windSpeed: hiddenCurrent.windSpd,
        windDirection: hiddenCurrent.windDrctnName,
        feel: { degrees: hiddenCurrent.stmpr, type: Scale.C },
        dust: dust.stationPM10Legend1,
        microDust: dust.stationPM25Legend1,
        condition: currentCondition,
        rainAmount: rainAmount,
        forecasts: hiddenForecasts,
        weeklyForecast: weeklyForecast,
    };
};

/**
 * Retrieves the hidden json data containing the current weather from the main weather page.
 *
 * @param {HTMLElement} weatherDoc
 * @return {*}  {HiddenForecast}
 */
const parseHiddenCurrent = (weatherDoc: HTMLElement): HiddenForecast => {
    const weatherSummary = findWeatherSummary(weatherDoc);
    return weatherSummary.nowFcast as HiddenForecast;
};

/**
 * Parse the rain details from the weather area.
 *
 * @param {HTMLElement} weatherArea
 * @return {*}  {number}
 */
const parseRain = (weatherArea: HTMLElement): number => {
    const rainArea = weatherArea.querySelector('.summary_rainfall');

    if (rainArea === undefined || rainArea === null) {
        return 0;
    }

    const rainAmount = rainArea.querySelector('strong').textContent;

    return Number(RAIN_REGEX.exec(rainAmount)![1]);
};

/**
 * Parses the hidden air data in the main weather page.
 *
 * @param {HTMLElement} weatherDoc
 * @return {*}  {HiddenAirForecast}
 */
const parseHiddenDust = (weatherDoc: HTMLElement): HiddenAirForecast => {
    const weatherSummary = findWeatherSummary(weatherDoc);
    return weatherSummary.airFcast as HiddenAirForecast;
};

/**
 * Finds and parses the hidden weather summary data from the main weather page.
 *
 * @param {HTMLElement} weatherDoc
 * @return {*}  {*}
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
 * Finds the hidden weather data js object in the web page
 * and parses the data.
 *
 * @param {HTMLElement} weatherDoc
 * @return {*}  {{
 *          forecasts: Forecast[];,
 *     }}
 */
const parseHiddenForecasts = (weatherDoc: HTMLElement): Forecast[] => {
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
        return [];
    }

    return data.map(hf => {
        let rainAmount = hf.rainAmt;
        if (rainAmount.lastIndexOf('~') >= 0) {
            const index = rainAmount.lastIndexOf('~') + 1;
            rainAmount = rainAmount.substring(index);
        }

        // sometimes the probablity is '-' instead of 0
        let rainProbability = hf.rainProb === '-' ? '0' : hf.rainProb;

        return {
            time: parseTime(hf.aplYmdt),

            condition: hf.wetrTxt,
            temperature: {
                degrees: hf.tmpr,
                type: Scale.C,
            },

            amount: Number(rainAmount),
            percentChance: Number(rainProbability),

            humidity: Number(hf.humd),

            direction: hf.windDrctnName,
            speed: Number(hf.windSpd),
        };
    });
};

/**
 * Parse a date from a date time string in the main weather page.
 *
 * @param {string} dateTime
 * @return {*}  {Date}
 */
const parseTime = (dateTime: string): Date => {
    DATE_TIME_REGEX.lastIndex = 0;
    const match = DATE_TIME_REGEX.exec(dateTime);

    return new Date(
        Number(match![1]),
        Number(match![2]),
        Number(match![3]),
        Number(match![4]),
        0,
        0,
        0
    );
};

/**
 * Parses the weekly forecast from the main weather page.
 *
 * @param {HTMLElement} weatherDoc
 * @return {*}  {WeeklyForecast[]}
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
 * @param {HTMLElement} inner
 * @return {*}  {{
 *         condition: string;
 *         rainChance: number;
 *     }}
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
    rainProb: string;
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

export const weatherService: WeatherService = {
    searchWeather: searchWeather,
    setWeatherSource: setWeatherSource,
};

export const locationService: LocationService = {
    searchLocation: searchLocation,
};

export default weatherService;
