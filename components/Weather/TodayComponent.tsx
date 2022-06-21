import { Weather } from '../../service/weatherService';
import { View, StyleSheet } from 'react-native';
import React from 'react';
import Current from './Current';
import WeatherForecastComponent from './WeatherForecast';
import HumidityForecastComponent from './HumidityForecast';
import RainForecastComponent from './RainForecast';
import WindForecastComponent from './WindForecast';

const TodayComponent = (props: { weather: Weather }) => {
    const weather = props.weather!;

    return (
        <View>
            <Current weather={weather} />
            <View style={styles.childContainer}>
                <WeatherForecastComponent weather={weather} />
            </View>
            <View style={styles.childContainer}>
                <HumidityForecastComponent weather={weather} />
            </View>
            <View style={styles.childContainer}>
                <RainForecastComponent weather={weather} />
            </View>
            <View style={styles.childContainer}>
                <WindForecastComponent weather={weather} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    childContainer: {
        flex: 1,
        maxWidth: 400,
    },
});

export default TodayComponent;
