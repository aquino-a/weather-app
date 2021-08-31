import React, { useState, useEffect } from 'react';
import { FlatList, ListRenderItem, View, Text, StyleSheet } from 'react-native';

import { humidityForecast, weather } from '../../service/weatherService';
import { getItemStyle } from './weatherChildren';

/**
 * A component that displays the humidity forecast.
 *
 * @param {{ weather: weather }} props
 * @return {*}
 */
const HumidityForecast = (props: { weather: weather }) => {
    const { humidityForecasts } = props.weather!;

    const renderHumidity: ListRenderItem<humidityForecast> = ({ item }) => {
        return (
            <View style={getItemStyle(item.time)}>
                <Text>{item.time.getHours()}</Text>
                <Text>{item.humidity}%</Text>
            </View>
        );
    };

    return (
        <View>
            <Text>Humidity:</Text>
            <FlatList
                // style={styles.list}
                data={humidityForecasts}
                renderItem={renderHumidity}
                keyExtractor={(humidity, index) =>
                    humidity.time.getTime().toString() + index
                }
                horizontal={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        width: 250,
    },
});

export default HumidityForecast;
