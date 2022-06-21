import { parse } from 'node-html-parser';

import { Location } from '../service/locationService';
import naverServiceInstance, { NaverService } from '../service/naverService';
import { Temperature, WeatherSource } from '../service/weatherService';

const fs = require('fs');
const fetch = require('node-fetch');
global.fetch = fetch;

const ns = new NaverService();

test('search 봉천동', async () => {
    expect(await ns.searchLocation('봉천동')).toStrictEqual<Location[]>([
        { name: '서울특별시 관악구 봉천동', code: '09620101' },
    ]);
});

test('search 이태원', async () => {
    const locations = await ns.searchLocation('이태원');

    expect(locations).not.toBeNull();
    expect(locations.length).toBe(3);
});

test('parse live weather page', async () => {
    var parsedWeather = await naverServiceInstance.searchWeather('09170130');

    expect(parsedWeather.condition).not.toBeNull();
    expect(parsedWeather.dust).not.toBeNull();
    expect(parsedWeather.condition).not.toBeNull();
    expect(parsedWeather.feel).not.toBeNull();
    expect(parsedWeather.humidity).toBeGreaterThan(0);
    expect(parsedWeather.humidityForecasts.length).toBeGreaterThan(0);
    expect(parsedWeather.microDust).not.toBeNull();
    expect(parsedWeather.rainAmount).toBeGreaterThan(-1);
    expect(parsedWeather.rainForecasts.length).toBeGreaterThan(0);
    expect(parsedWeather.temperature).not.toBeNull();
    expect(parsedWeather.weatherForecasts.length).toBeGreaterThan(0);
    expect(parsedWeather.windDirection).not.toBeNull();
    expect(parsedWeather.windForecasts.length).toBeGreaterThan(0);
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
});

test('set weather source', async () => {
    var parsedWeather = await naverServiceInstance.searchWeather('09170130');

    await naverServiceInstance.setWeatherSource(
        '09170130',
        WeatherSource.ACCUWEATHER
    );
    // var newParsedWeather = await naverServiceInstance.searchWeather('09170130');

    console.log(JSON.stringify(parsedWeather));
});
