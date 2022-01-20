import naver from './naverService';
import { LocationService } from './locationService';
import { WeatherService } from './weatherService';

export const locationServiceInstance: LocationService = naver;
export const weatherServiceInstance: WeatherService = naver;
