import React, { useState, useEffect } from 'react';
import { ListRenderItem, View, Text, FlatList, StyleSheet } from 'react-native';

import { weather, weatherForecast } from '../../service/weatherService';
import { childStyles } from './Weather';


/**
 * A component that displays the weather forecasts.
 *
 * @param {{ weather: weather }} props
 * @return {*} 
 */
const WeatherForecast = (props: { weather: weather }) => {

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
        <View style={childStyles.container}>
            <Text>
                Weather:
            </Text>
            <FlatList
                // style={styles.list}
                data={weatherForecasts}
                renderItem={renderWeather}
                keyExtractor={(weather, index) => weather.time.getTime().toString() + index}
                horizontal={true}
            />
        </View>
    );
}

export default WeatherForecast;