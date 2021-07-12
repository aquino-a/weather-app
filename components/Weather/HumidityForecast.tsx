import React, { useState, useEffect } from 'react';
import { FlatList, ListRenderItem, View, Text, StyleSheet } from 'react-native';
import { humidityForecast } from '../../service/weatherService';

import { weatherChildProps } from './Weather';


/**
 * A component that displays the humidity forecast.
 *
 * @param {weatherChildProps} props
 * @return {*} 
 */
const HumidityForecast = (props: weatherChildProps) => {

    const { humidityForecasts } = props.weather!;

    const renderHumidity: ListRenderItem<humidityForecast> = ({ item }) => {
        return (
            <View >
                <Text>{item.time.getHours()}</Text>
                <Text>{item.humidity}%</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>
                Humidity: 
            </Text>
            <FlatList
                style={styles.list}
                data={humidityForecasts}
                renderItem={renderHumidity}
                // keyExtractor={humidity => humidity.time.getTime().toString()}
                horizontal={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
      width: 500
    },
  });

export default HumidityForecast;