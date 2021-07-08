import { location } from './locationService';
import { naverService } from './naverService';
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