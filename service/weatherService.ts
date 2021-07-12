import { ScaledSize } from "react-native";

export interface weatherService {
    searchWeather(locationCode: string): Promise<weather>;
}

class fakeWeatherService implements weatherService {
    searchWeather(locationCode: string): Promise<weather> {
        return Promise.resolve({
            condition: 'condition',
            dust: 'good',
            feel: { degrees: Math.ceil((Math.random() * 10) + 20), type: scale.C },
            humidity: Math.ceil(Math.random() * 100),
            humidityForecasts: this.generateHumidityForecasts(),
            microDust: 'good',
            rainAmount: Math.ceil(Math.random() * 5),
            rainForecasts: [],
            temperature: { degrees: Math.ceil((Math.random() * 10) + 20), type: scale.F },
            weatherForecasts: this.generateWeatherForecasts(),
            windDirection: 'north west',
            windForecasts: [],
            windSpeed: Math.ceil(Math.random() * 5)
        });
    }

    generateHumidityForecasts = (): humidityForecast[] => {

        const forecasts: humidityForecast[] = [];
        for (let i = 0; i < 70; i++) {
            forecasts.push({
                humidity: Math.ceil(Math.random() * 100),
                time: new Date()
            });
        }
        return forecasts;
    }

    generateWeatherForecasts = (): weatherForecast[] => {

        const forecasts: weatherForecast[] = [];
        for (let i = 0; i < 70; i++) {
            forecasts.push({
                condition: 'good',
                temperature: { degrees: 20 + Math.ceil(Math.random() * 15), type: scale.C },
                time: new Date()
            });
        }
        return forecasts;
    }
}

export interface weather {
    temperature: temperature;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    feel: temperature;
    dust: string;
    microDust: string;
    condition: string;
    rainAmount: number;

    rainForecasts: rainForecast[];
    humidityForecasts: humidityForecast[];
    windForecasts: windForecast[];
    weatherForecasts: weatherForecast[];
}

export interface temperature {
    degrees: number;
    type: scale;
}

export enum scale {
    C, F
}

export interface weatherForecast {
    temperature: temperature;
    condition: string;
    time: Date;
}

export interface rainForecast {
    percentChance: number;
    amount: number;
    time: Date;
}

export interface humidityForecast {
    humidity: number;
    time: Date;
}

export interface windForecast {
    direction: string;
    speed: number;
    time: Date;
}


const fakeService: weatherService = new fakeWeatherService();

export default fakeService;
