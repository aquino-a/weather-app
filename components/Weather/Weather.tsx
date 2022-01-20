import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    RefreshControl,
} from 'react-native';

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
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const searchWeather = async () => {
        try {
            const foundWeather = await weatherService.searchWeather(
                location!.code
            );
            setWeather(foundWeather);
        } catch (error) {
            console.log('weather result in wrong format');
            console.log(error);
            Alert.alert('Data unavailable.', 'Choose different location.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await searchWeather();
        setRefreshing(false);
    };

    useEffect(() => {
        if (!location || location.code === '') {
            return;
        }
        searchWeather();
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
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    childContainer: {
        flex: 1,
        maxWidth: 400,
    },
    current: {
        flex: 1,
    },
});

export default Weather;
