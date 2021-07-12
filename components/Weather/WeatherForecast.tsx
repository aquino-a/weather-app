import React, { useState, useEffect } from 'react';
import { ListRenderItem, View, Text, FlatList, StyleSheet } from 'react-native';

import { weatherForecast } from '../../service/weatherService';
import { weatherChildProps } from './Weather';


/**
 * A component that displays the weather forecasts.
 *
 * @param {weatherChildProps} props
 * @return {*} 
 */
const WeatherForecast = (props: weatherChildProps) => {

    const { weatherForecasts } = props.weather!;

    const renderWeather: ListRenderItem<weatherForecast> = ({ item }) => {
        return (
            <View >
                <Text>{item.time.getHours()}</Text>
                <Text>{item.condition}</Text>
                <Text>{item.temperature.degrees}°</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>
                Weather:
            </Text>
            <FlatList
                style={styles.list}
                data={weatherForecasts}
                renderItem={renderWeather}
                keyExtractor={(weather, index) => weather.time.getTime().toString() + index}
                horizontal={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        width: 250
    },
});

export default WeatherForecast;