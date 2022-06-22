export interface Location {
    name: string;
    code: string;
}

export const locationKey: string = 'CurrentLocation';

export const defaultLocation: Location = { name: 'Set Location', code: '' };

export interface LocationService {
    searchLocation(query: string): Promise<Location[]>;
}

export default class FakeLocationService implements LocationService {
    async searchLocation(_query: string): Promise<Location[]> {
        return Promise.resolve([
            { name: '서울특별시 용산구 이태원동', code: '09170130' },
            { name: '서울특별시 용산구 이태원2동', code: '09170660' },
            { name: '서울특별시 용산구 이태원1동', code: '09170650' },
        ]);
    }
}
