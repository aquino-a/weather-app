export interface location {
    name: string,
    code: string
}

export interface locationService {
    searchLocation(query: string): Promise<location[]>;
}

class fakeLocationService implements locationService {

    async searchLocation(query: string): Promise<location[]> {
        return Promise.resolve([{ name: "중구", code: "1010101" }]);
    }
}

const fakeService: locationService = new fakeLocationService();

export default fakeService;

