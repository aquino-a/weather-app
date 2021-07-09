import { location } from './locationService';
import { naverService } from './naverService';
import { weather } from './weatherService';

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
    const rawHtml = fs.readFileSync('./service/weather-parse-test.html')
    const weatherDoc = new JSDOM(rawHtml).window.document;

    const parsedWeather = naverService.parseWeather(weatherDoc);

    fail();
    expect(
        parsedWeather)
        .toStrictEqual<any>(
           undefined);

  });