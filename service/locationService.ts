export interface location {
    name: string,
    code: string
}

interface locationService {
    searchLocation(query: string): Promise<location[]>;
}

class fakeLocationService implements locationService {

    async searchLocation(query: string): Promise<location[]> {
        return Promise.resolve([{ name: "중구", code: "1010101" }]);
    }
}

class naverLocationService implements locationService {
    // https://ac.weather.naver.com/ac?q_enc=utf-8&r_format=json&r_enc=utf-8&r_lt=1&st=1&q=%EC%82%B0%ED%95%98%EB%8F%99
    searchLocation(query: string): Promise<location[]> {
        throw new Error("Method not implemented.");
    }

}

const fakeService: locationService = new fakeLocationService();

export default fakeService;

