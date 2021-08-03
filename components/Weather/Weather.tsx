import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
 * @param {{ location: location }} props
 * @return {*} 
 */
const Weather = (props: { location: location }) => {

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

export const childStyles = StyleSheet.create({
    container: {
        width: '100%'
    },
});

export default Weather;