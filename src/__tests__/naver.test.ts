import naverServiceInstance, { searchLocation } from '../service/naver';
import { Weather } from '../service/weatherService';

const fetch = require('node-fetch');
global.fetch = fetch;

test('search 이태원', async () => {
    const locations = await searchLocation('이태원');

    expect(locations).not.toBeNull();
    expect(locations.length).toBe(3);
});

const testParsedWeather = (parsedWeather: Weather) => {
    expect(parsedWeather.condition).not.toBeNull();
    expect(parsedWeather.dust).not.toBeNull();
    expect(parsedWeather.condition).not.toBeNull();
    expect(parsedWeather.feel).not.toBeNull();
    expect(parsedWeather.humidity).toBeGreaterThan(0);
    expect(parsedWeather.microDust).not.toBeNull();
    expect(parsedWeather.rainAmount).toBeGreaterThan(-1);
    expect(parsedWeather.temperature).not.toBeNull();
    expect(parsedWeather.windDirection).not.toBeNull();
    expect(parsedWeather.windSpeed).toBeGreaterThan(-1);
    expect(parsedWeather.weeklyForecast).not.toBeNull();
    expect(parsedWeather.weeklyForecast.length).toBe(10);

    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() + 9);

    expect(parsedWeather.weeklyForecast[9].afternoon.time.getMonth()).toBe(
        lastDay.getMonth()
    );
    expect(parsedWeather.weeklyForecast[9].afternoon.time.getDate()).toBe(
        lastDay.getDate()
    );

    expect(parsedWeather.forecasts.length).toBeGreaterThan(0);
    for (let i = 1; i < parsedWeather.forecasts.length; i++) {
        const a = parsedWeather.forecasts[i - 1];
        const b = parsedWeather.forecasts[i];

        a.time.setHours(a.time.getHours() + 1);

        expect(a.time).toEqual<Date>(b.time);
    }
};

test('parse live weather page', async () => {
    const parsedWeather = await naverServiceInstance.searchWeather('09170130');

    testParsedWeather(parsedWeather);
});

test('parse live weather page - global location', async () => {
    const parsedWeather = await naverServiceInstance.searchWeather(
        'WDUSA15235'
    );

    testParsedWeather(parsedWeather);
});
