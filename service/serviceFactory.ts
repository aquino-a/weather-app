import naver from "./naverService";
import { locationService } from "./locationService";
import { weatherService } from "./weatherService";

export const locationServiceInstance : locationService = naver;
export const weatherServiceInstance: weatherService = naver;
