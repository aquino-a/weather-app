import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import { weatherServiceInstance as weatherService } from '../../service/serviceFactory';
import { location } from '../../service/locationService';
import { weather } from '../../service/weatherService';

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
            .then(setWeather)
            .catch(e => {
                console.log("weather result in wrong format");
                console.log(e);
                Alert.alert("Data unavailable.", "Choose different location.")
            });
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
            <View style={styles.childContainer}>
                <WeatherForecast weather={weather} />
            </View>
            <View style={styles.childContainer}>
                <HumidityForecast weather={weather} />
            </View>
            <View style={styles.childContainer}>
                <RainForecast weather={weather} />
            </View>
            <View style={styles.childContainer}>
                <WindForecast weather={weather} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    childContainer: {
        flex: 1,
        maxWidth: 400
    },
});

export default Weather;