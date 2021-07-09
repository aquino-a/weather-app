import { template } from "@babel/core";
import { location, locationService } from "./locationService";
import { scale, temperature, weather, weatherService } from "./weatherService";

/**
 * A service that communicates with the naver api.
 *
 * @export
 * @class naverService
 * @implements {locationService}
 */
export class naverService implements locationService, weatherService {

    static readonly NAVER_BASE_URL: string = "weather.naver.com";
    static readonly TEMPERATURE_REGEX: RegExp = new RegExp('(\\d+)°');
    static readonly PERCENT_REGEX: RegExp = new RegExp('(\\d+)%');
    static readonly SPEED_REGEX: RegExp = new RegExp('(\\d+) *m/s');

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

        return {
            temperature: currentTemperature,
            humidity: listDetails.humidity,
            windSpeed: listDetails.windSpeed,
            windDirection: listDetails.windDirection,
            feel: listDetails.feel,
            dust: '',
            microDust: '',
            condition: currentCondition,
            rainAmount: 0,
            rainForecasts: [],
            humidityForecasts: [],
            windForecasts: [],
            temperatureForecasts: []
        };
    }
    
    private static parseTemperature(currentWeather: Element): temperature {
        const line = currentWeather.getElementsByClassName('current')[0].textContent;
        return { degrees: Number(naverService.TEMPERATURE_REGEX.exec(line)[1]), type: scale.C } ;
    }

    private static parseListDetails(currentWeather: Element): any {
        const list = currentWeather.getElementsByClassName('summary_list')[0];

        return {
            humidity: Number(naverService.PERCENT_REGEX.exec(list.children[1].textContent)[1]),
            windDirection: list.children[2].textContent,
            windSpeed: Number(naverService.SPEED_REGEX.exec(list.children[3].textContent)[1]),
            feel: { degrees: Number(naverService.TEMPERATURE_REGEX.exec(list.children[5].textContent)[1]), type: scale.C }
        };
    }
}


