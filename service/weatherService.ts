import { ScaledSize } from "react-native";

export interface weatherService {
    searchWeather(locationCode: string): Promise<weather>;
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
    temperatureForecasts: rainForecast[];
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