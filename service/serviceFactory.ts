import { weatherService, locationService } from './naverService';
import { LocationService } from './locationService';
import { WeatherService } from './weatherService';

export const locationServiceInstance: LocationService = locationService;
export const weatherServiceInstance: WeatherService = weatherService;
