import { location, locationService } from "./locationService";
import { humidityForecast, rainForecast, scale, temperature, weather, weatherForecast, weatherService, windForecast } from "./weatherService";

/**
 * A service that communicates with the naver api.
 *
 * @export
 * @class naverService
 * @implements {locationService}
 */
export class naverService implements locationService, weatherService {

    static readonly NAVER_BASE_URL: string = "weather.naver.com";
    static readonly TEMPERATURE_REGEX: RegExp = new RegExp('(\\d+)(?:°|도)');
    static readonly PERCENT_REGEX: RegExp = new RegExp('(\\d+)%');
    static readonly SPEED_REGEX: RegExp = new RegExp('(\\d+) *m/s');
    static readonly RAIN_REGEX: RegExp = new RegExp('(\\d+(?:\\.\\d+)?) *mm');

    /**
     * Searchs the naver api for the location name and location code using a text query.
     *
     * @param {string} query the location to search for by name.
     * @return {*}  {Promise<location[]>}
     * @memberof naverService
     */
    async searchLocation(query: string): Promise<location[]> {

        const url = new URL(`https://ac.${naverService.NAVER_BASE_URL}/ac`);
        url.searchParams.append('q_enc', 'utf-8');
        url.searchParams.append('r_format', 'json');
        url.searchParams.append('r_enc', 'utf-8');
        url.searchParams.append('r_lt', '1');
        url.searchParams.append('st', '1');
        url.searchParams.append('q', query);

        const response = await fetch(url);
        const result = await response.json();

        return this.parseLocations(result);
    }

    /**
     * Parses the object returned by the naver location api.
     *
     * @param {*} rawObject the object containing the results.
     * @memberof naverService
     */
    parseLocations = (rawObject: any): location[] => {
        return rawObject.items[0]
            .map((a: string[][]) => ({ name: a[0][0], code: a[1][0] }));
    }

    /**
     * Searchs for the weather based on the location code.
     *
     * @param {string} locationCode the code of the location to search for.
     * @return {*}  {Promise<weather>}
     * @memberof naverService
     */
    async searchWeather(locationCode: string): Promise<weather> {

        const url = new URL(`https://${naverService.NAVER_BASE_URL}/today/${locationCode}`);

        const response = await fetch(url);
        const rawHtml = await response.text();
        const domParser = new DOMParser();

        const weatherDoc = domParser.parseFromString(rawHtml, 'text/html');

        return naverService.parseWeather(weatherDoc);
    }

    /**
     * Parse the weather from a naver weather page.
     *
     * @static
     * @param {Document} weatherDoc the naver weather web page.
     * @return {*}  {(weather)} the weather data from the web page.
     * @memberof naverService
     */
    static parseWeather(weatherDoc: Document): weather {

        // weather_area
        const weatherArea = weatherDoc.getElementsByClassName('weather_area')[0] as HTMLElement;
        const currentTemperature = naverService.parseTemperature(weatherArea);
        const listDetails = naverService.parseListDetails(weatherArea);
        const currentCondition = weatherArea.getElementsByClassName('weather')[0].textContent as string;
        const rainAmount = naverService.parseRain(weatherArea);
        const dust = naverService.parseDust(weatherDoc);

        //forecasts
        const weatherForecasts = naverService.parseWeatherForecasts(weatherDoc);
        const rainForecasts = naverService.parseRainForecasts(weatherDoc);
        const humidityForecasts = naverService.parseHumidityForecasts(weatherDoc);
        const windForecasts = naverService.parseWindForecasts(weatherDoc);

        return {
            temperature: currentTemperature,
            humidity: listDetails.humidity,
            windSpeed: listDetails.windSpeed,
            windDirection: listDetails.windDirection,
            feel: listDetails.feel,
            dust: dust.dust,
            microDust: dust.microDust,
            condition: currentCondition,
            rainAmount: rainAmount,
            rainForecasts: rainForecasts,
            humidityForecasts: humidityForecasts,
            windForecasts: windForecasts,
            weatherForecasts: weatherForecasts
        };
    }

    /**
     * Parses the temperature from the weather area section.
     *
     * @private
     * @static
     * @param {Element} weatherArea
     * @return {*}  {temperature}
     * @memberof naverService
     */
    private static parseTemperature(weatherArea: Element): temperature {

        const line = weatherArea.getElementsByClassName('current')[0].textContent;

        return { degrees: Number(naverService.TEMPERATURE_REGEX.exec(line)[1]), type: scale.C };
    }

    /**
     * Parses the details of the summary list in the weather area.
     *
     * @private
     * @static
     * @param {Element} weatherArea
     * @return {*}  {*}
     * @memberof naverService
     */
    private static parseListDetails(weatherArea: Element): any {

        const list = weatherArea.getElementsByClassName('summary_list')[0];

        return {
            humidity: Number(naverService.PERCENT_REGEX.exec(list.children[1].textContent)[1]),
            windDirection: list.children[2].textContent,
            windSpeed: Number(naverService.SPEED_REGEX.exec(list.children[3].textContent)[1]),
            feel: { degrees: Number(naverService.TEMPERATURE_REGEX.exec(list.children[5].textContent)[1]), type: scale.C }
        };
    }

    /**
     * Parse the rain details from the weather area.
     *
     * @private
     * @static
     * @param {HTMLElement} weatherArea
     * @return {*}  {number}
     * @memberof naverService
     */
    private static parseRain(weatherArea: HTMLElement): number {

        const rainAmount = weatherArea
            .getElementsByClassName('summary_rainfall')[0]
            .getElementsByTagName('strong')[0].textContent;

        return Number(naverService.RAIN_REGEX.exec(rainAmount)[1])
    }

    /**
     * Parse the dust details from the main weather document.
     *
     * @private
     * @static
     * @param {Document} weatherDoc
     * @return {*}  {*}
     * @memberof naverService
     */
    private static parseDust(weatherDoc: Document): any {

        const list = weatherDoc
            .getElementsByClassName('today_chart_list')[0]
            .getElementsByClassName('level_text');

        return {
            dust: list[0].textContent,
            microDust: list[1].textContent,
        }
    }


    /**
     * Parse the weather forecasts from the main weather page.
     *
     * @private
     * @static
     * @param {Document} weatherDoc
     * @return {*}  {weatherForecast[]}
     * @memberof naverService
     */
    private static parseWeatherForecasts(weatherDoc: Document): weatherForecast[] {
        return Array.from(
            weatherDoc
                .getElementsByClassName('time_list align_left')[0]
                .children)
            .map((e: Element): weatherForecast => {

                const degrees = Number(e.getAttribute('data-tmpr'));
                const condition = e.getAttribute('data-wetr-txt') as string;

                const dateTime = e.getAttribute('data-ymdt') as string;
                const time = naverService.parseTime(dateTime)

                return {
                    temperature: { degrees: degrees, type: scale.C },
                    condition: condition,
                    time: time,
                }
            });
    }


    /**
     * Parse the rain forecasts from the main weather page.
     *
     * @private
     * @static
     * @param {Document} weatherDoc
     * @return {*}  {rainForecast[]}
     * @memberof naverService
     */
    private static parseRainForecasts(weatherDoc: Document): rainForecast[] {

        const rainSection = weatherDoc.querySelector('div[data-nclk="wtk.rainhrscr"]');

        const percentages = rainSection?.
            querySelector('tr.row_icon')?.
            querySelectorAll('td.data');

        const amounts = rainSection?.
            querySelector('tr.row_graph.row_rain')?.
            querySelectorAll('td.data');

        if (percentages === undefined
            || amounts === undefined
            || percentages.length != amounts.length) {
            return [];
        }

        const rainForecasts: rainForecast[] = [];
        for (let i = 0; i < percentages.length; i++) {
            const percentage = percentages[i];
            const amount = amounts[i];

            rainForecasts.push(
                {
                    percentChance: Number(percentage.querySelector('em.value')?.textContent),
                    amount: Number(amount.querySelector('div.data_inner')?.textContent),
                    time: naverService.parseTime(percentage.getAttribute('data-ymdt') as string)
                }
            );
        }

        return rainForecasts;
    }


    /**
     * Parse the humidity forecasts from the main weather page.
     *
     * @private
     * @static
     * @param {Document} weatherDoc
     * @return {*}  {humidityForecast[]}
     * @memberof naverService
     */
    private static parseHumidityForecasts(weatherDoc: Document): humidityForecast[] {

        const humiditySection = weatherDoc.querySelector('div[data-nclk="wtk.humihrscr"]');

        const humidities = humiditySection?.
            querySelectorAll('td.data');

        if (humidities === undefined) {
            return [];
        }

        return Array.from(humidities)
            .map((e: Element): humidityForecast => ({
                humidity: Number(e.querySelector('span.num')?.textContent),
                time: naverService.parseTime(e.getAttribute('data-ymdt') as string)
            }));
    }

    /**
     * Parse the wind forecasts from the main weather page.
     *
     * @private
     * @static
     * @param {Document} weatherDoc
     * @return {*}  {windForecast[]}
     * @memberof naverService
     */
    private static parseWindForecasts(weatherDoc: Document): windForecast[] {

        const windSection = weatherDoc.querySelector('div[data-nclk="wtk.windhrscr"]');

        const directions = windSection?.
            querySelector('tr.row_icon')?.
            querySelectorAll('td.data');

        const speeds = windSection?.
            querySelector('tr.row_graph')?.
            querySelectorAll('td.data');

        if (directions === undefined
            || speeds === undefined
            || directions.length != speeds.length) {
            return [];
        }

        const windForecasts: windForecast[] = [];
        for (let i = 0; i < directions.length; i++) {
            const direction = directions[i];
            const speed = speeds[i];

            windForecasts.push(
                {
                    direction: direction.querySelector('span.value')?.textContent as string,
                    speed: Number(speed.querySelector('span.num')?.textContent),
                    time: naverService.parseTime(speed.getAttribute('data-ymdt') as string)
                }
            );
        }

        return windForecasts;
    }

    /**
     * Parse a date from a date time string in the main weather page.
     *
     * @private
     * @static
     * @param {string} dateTime
     * @return {*}  {Date}
     * @memberof naverService
     */
    private static parseTime(dateTime: string): Date {
        return new Date(
            Number(dateTime.substr(0, 4)),
            Number(dateTime.substr(4, 2)) - 1,
            Number(dateTime.substr(6, 2)),
            Number(dateTime.substr(8, 2)),
            0, 0, 0);
    }
}

const naverServiceInstance = new naverService();

export default naverServiceInstance;
