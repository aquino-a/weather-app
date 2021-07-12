import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { location } from '../../service/locationService';
import weatherService, { weather } from '../../service/weatherService';

import Current from './Current';
import HumidityForecast from './HumidityForecast';
import RainForecast from './RainForecast';
import WeatherForecast from './WeatherForecast';
import WindForecast from './WindForecast';


/**
 * The parent component of all weather child components.
 *
 * @param {weatherProps} props
 * @return {*} 
 */
const Weather = (props: weatherProps) => {

    const { location } = props;

    const [weather, setWeather] = useState<weather | null>(null);

    useEffect(() => {
        if (!location || location.code === '') {
            return;
        }
        weatherService.searchWeather(location!.code)
            .then(setWeather);
    }, [location]);

    if (!location || location.code === '') {
        return (
            <View>
                <Text>Choose Location.</Text>
            </View>
        );
    }

    if (!weather) {
        return (
            <View>
                <Text>Loading..</Text>
            </View>
        );
    }

    return (
        <View>
            <Current weather={weather} />
            <WeatherForecast weather={weather} />
            <HumidityForecast weather={weather} />
            <RainForecast weather={weather} />
            <WindForecast weather={weather} />
        </View>
    );
}

export interface weatherProps {
    location: location | null;
}

export interface weatherChildProps {
    weather: weather | null;
}


export default Weather;