import React, { useState, useEffect } from 'react';
import { ListRenderItem, View, Text, FlatList, StyleSheet } from 'react-native';

import { rainForecast } from '../../service/weatherService';
import { weatherChildProps } from './Weather';


/**
 * A component that displays the rain forecasts.
 *
 * @param {weatherChildProps} props
 * @return {*} 
 */
const RainForecast = (props: weatherChildProps) => {
    const { rainForecasts } = props.weather!;

    const renderRain: ListRenderItem<rainForecast> = ({ item }) => {
        return (
            <View >
                <Text>{item.time.getHours()}</Text>
                <Text>{item.percentChance}%</Text>
                <Text>{item.amount}mm</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>
                Rain:
            </Text>
            <FlatList
                style={styles.list}
                data={rainForecasts}
                renderItem={renderRain}
                keyExtractor={(rain, index) => rain.time.getTime().toString() + index}
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

export default RainForecast;