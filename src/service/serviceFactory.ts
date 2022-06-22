import { weatherService, locationService } from './naver';
import { LocationService } from './locationService';
import { WeatherService } from './weatherService';

export const locationServiceInstance: LocationService = locationService;
export const weatherServiceInstance: WeatherService = weatherService;
