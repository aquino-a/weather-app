import naver from './naverService';

export interface location {
    name: string;
    code: string;
}

export const locationKey: string = 'CurrentLocation';

export const defaultLocation: location = { name: 'Set Location', code: '' };

export interface locationService {
    searchLocation(query: string): Promise<location[]>;
}

export default class fakeLocationService implements locationService {
    async searchLocation(query: string): Promise<location[]> {
        return Promise.resolve([
            { name: '서울특별시 용산구 이태원동', code: '09170130' },
            { name: '서울특별시 용산구 이태원2동', code: '09170660' },
            { name: '서울특별시 용산구 이태원1동', code: '09170650' },
        ]);
    }
}
