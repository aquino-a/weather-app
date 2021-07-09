import { template } from "@babel/core";
import { location, locationService } from "./locationService";
import { scale, temperature, weather, weatherForecast, weatherService } from "./weatherService";

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
            rainForecasts: [],
            humidityForecasts: [],
            windForecasts: [],
            weatherForecasts: []
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

                const ts = e.getAttribute('data-ymdt') as string;
                const time = new Date(
                    Number(ts.substr(0,4)),
                    Number(ts.substr(4,2)), 
                    Number(ts.substr(6,2)),
                    Number(ts.substr(8,2)),
                    0,0,0);

                return {
                    temperature: { degrees: degrees, type: scale.C },
                    condition: condition,
                    time: time,
                }
            });
    }
}


