import { location, locationService } from "./locationService";

/**
 * A service that communicates with the naver api.
 *
 * @export
 * @class naverService
 * @implements {locationService}
 */
export class naverService implements locationService {

    static readonly NAVER_BASE_URL: string = "https://ac.weather.naver.com";

    /**
     * Searchs the naver api for the location name and location code using a text query.
     *
     * @param {string} query the location to search for by name.
     * @return {*}  {Promise<location[]>}
     * @memberof naverService
     */
    async searchLocation(query: string): Promise<location[]> {
        
        const url = new URL(`${naverService.NAVER_BASE_URL}/ac`);
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
}

