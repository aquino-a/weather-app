export interface WeatherService {
    searchWeather(locationCode: string): Promise<Weather>;
    setWeatherSource(
        locationCode: string,
        source: WeatherSource
    ): Promise<void>;
}

export default class FakeWeatherService implements WeatherService {
    setWeatherSource(
        _locationCode: string,
        _source: WeatherSource
    ): Promise<void> {
        return Promise.resolve();
    }

    searchWeather(_locationCode: string): Promise<Weather> {
        return Promise.resolve({
            condition: 'condition',
            dust: 'good',
            feel: {
                degrees: Math.ceil(Math.random() * 10 + 20),
                type: Scale.C,
            },
            humidity: Math.ceil(Math.random() * 100),
            humidityForecasts: this.generateHumidityForecasts(),
            microDust: 'good',
            rainAmount: Math.ceil(Math.random() * 5),
            rainForecasts: this.generateRainForecasts(),
            temperature: {
                degrees: Math.ceil(Math.random() * 10 + 20),
                type: Scale.F,
            },
            weatherForecasts: this.generateWeatherForecasts(),
            windDirection: 'north west',
            windForecasts: this.generateWindForecasts(),
            windSpeed: Math.ceil(Math.random() * 5),
        });
    }

    generateHumidityForecasts = (): HumidityForecast[] => {
        const forecasts: HumidityForecast[] = [];
        for (let i = 0; i < 70; i++) {
            forecasts.push({
                humidity: Math.ceil(Math.random() * 100),
                time: new Date(),
            });
        }
        return forecasts;
    };

    generateWeatherForecasts = (): WeatherForecast[] => {
        const forecasts: WeatherForecast[] = [];
        for (let i = 0; i < 70; i++) {
            forecasts.push({
                condition: 'good',
                temperature: {
                    degrees: 20 + Math.ceil(Math.random() * 15),
                    type: Scale.C,
                },
                time: new Date(),
            });
        }
        return forecasts;
    };

    generateRainForecasts = (): RainForecast[] => {
        const forecasts: RainForecast[] = [];
        for (let i = 0; i < 70; i++) {
            forecasts.push({
                amount: Math.ceil(Math.random() * 25),
                percentChance: Math.ceil(Math.random() * 100),
                time: new Date(),
            });
        }
        return forecasts;
    };

    generateWindForecasts = (): WindForecast[] => {
        const forecasts: WindForecast[] = [];
        for (let i = 0; i < 70; i++) {
            forecasts.push({
                direction: 'north west',
                speed: Math.ceil(Math.random() * 5),
                time: new Date(),
            });
        }
        return forecasts;
    };
}

export interface Weather {
    temperature: Temperature;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    feel: Temperature;
    dust: string;
    microDust: string;
    condition: string;
    rainAmount: number;

    rainForecasts: RainForecast[];
    humidityForecasts: HumidityForecast[];
    windForecasts: WindForecast[];
    weatherForecasts: WeatherForecast[];

    weeklyForecast: WeeklyForecast[];
}

export interface Temperature {
    degrees: number;
    type: Scale;
}

export enum Scale {
    C,
    F,
}

export enum WeatherSource {
    ACCUWEATHER,
    KMA,
    TWC,
}

export interface WeatherForecast {
    temperature: Temperature;
    condition: string;
    time: Date;
}

export interface RainForecast {
    percentChance: number;
    amount: number;
    time: Date;
}

export interface HumidityForecast {
    humidity: number;
    time: Date;
}

export interface WindForecast {
    direction: string;
    speed: number;
    time: Date;
}

/**
 * The forecast for a of the week.
 *
 * @interface WeeklyForecast
 */
export interface WeeklyForecast {
    morning: BasicForecast;
    afternoon: BasicForecast;
}

/**
 * The forecast used for the days of the week.
 *
 * @interface BasicForecast
 */
export interface BasicForecast {
    time: Date;
    temperature: Temperature;
    condition: string;
    rainChance: number;
}
