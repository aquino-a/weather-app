import React, { useState, useEffect } from 'react';
import { ListRenderItem, View, Text, FlatList, StyleSheet } from 'react-native';

import { rainForecast, weather } from '../../service/weatherService';
import { baseStyle, getItemStyle } from './weatherChildren';

/**
 * A component that displays the rain forecasts.
 *
 * @param {{ weather: weather }} props
 * @return {*}
 */
const RainForecast = (props: { weather: weather }) => {
    const { rainForecasts } = props.weather!;

    const renderRain: ListRenderItem<rainForecast> = ({ item }) => {
        return (
            <View style={[getItemStyle(item.time), baseStyle]}>
                <Text>{item.time.getHours()}</Text>
                <Text>{item.percentChance}%</Text>
                <Text>{item.amount}mm</Text>
            </View>
        );
    };

    return (
        <View>
            <Text>Rain:</Text>
            <FlatList
                // style={styles.list}
                data={rainForecasts}
                renderItem={renderRain}
                keyExtractor={(rain, index) =>
                    rain.time.getTime().toString() + index
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

export default RainForecast;
