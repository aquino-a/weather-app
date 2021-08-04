import { parse } from 'node-html-parser';

import { location } from '../locationService';
import { naverService } from '../naverService';
import { temperature, weather } from '../weatherService';

// const jsdom = require("jsdom");
const { JSDOM } = require("jsdom");
const fs = require('fs');
const fetch = require('node-fetch');
global.fetch = fetch


const ns = new naverService();

test('search 봉천동', async () => {
    
    expect(
        await ns.searchLocation('봉천동'))
        .toStrictEqual<location[]>(
            [
                { name: '서울특별시 관악구 봉천동', code: '09620101' }
            ]);

  });

  test('search 이태원', async () => {
    
    expect(
        await ns.searchLocation('이태원'))
        .toStrictEqual<location[]>(
            [
                { name: '서울특별시 용산구 이태원동', code: '09170130' },
                { name: '서울특별시 용산구 이태원2동', code: '09170660' },
                { name: '서울특별시 용산구 이태원1동', code: '09170650' },
            ]);

  });

  test('parse weather', async () => {
    const rawHtml = fs.readFileSync('./service/test/weather-parse-test.html')
    const weatherDoc = parse(rawHtml);

    const parsedWeather = naverService.parseWeather(weatherDoc);

    expect(
        parsedWeather.condition)
        .toBe<string>('소나기');
    expect(
        parsedWeather.dust)
        .toBe<string>('좋음');
    expect(
        parsedWeather.condition)
        .toBe<string>('소나기');
    expect(
        parsedWeather.feel)
        .toStrictEqual<temperature>({degrees: 23, type: 0});
    expect(
        parsedWeather.humidity)
        .toBe<number>(95);
    expect(
        parsedWeather.humidityForecasts.length)
        .toBe<number>(70);
    expect(
        parsedWeather.microDust)
        .toBe<string>('좋음');
    expect(
        parsedWeather.rainAmount)
        .toBe<number>(0.1);
    expect(
        parsedWeather.rainForecasts.length)
        .toBe<number>(70);
    expect(
        parsedWeather.temperature)
        .toStrictEqual<temperature>({degrees: 21, type: 0});
    expect(
        parsedWeather.weatherForecasts.length)
        .toBe<number>(71);
    expect(
        parsedWeather.windDirection)
        .toBe<string>('북북동풍');
    expect(
        parsedWeather.windForecasts.length)
        .toBe<number>(70);
    expect(
        parsedWeather.windSpeed)
        .toBe<number>(1);
  });