import React from 'react';
import { ListRenderItem, View, Text, FlatList } from 'react-native';

import { Forecast, Weather } from '../../service/weatherService';
import { baseStyle, getItemStyle } from './weatherChildren';

/**
 * A component that displays the forecasts.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const ForecastComponent = (props: { weather: Weather }) => {
    const { forecasts } = props.weather!;

    const renderWeather: ListRenderItem<Forecast> = ({ item }) => {
        return (
            <View style={[getItemStyle(item.time), baseStyle]}>
                <Text>{item.time.getHours()}</Text>
                <Text>{item.condition}</Text>
                <Text>{item.temperature.degrees}°</Text>
                <Text>{item.humidity}%</Text>
                <Text>{item.direction}</Text>
                <Text>{item.speed}m/s</Text>
                <Text>{item.percentChance}%</Text>
                <Text>{item.amount}mm</Text>
            </View>
        );
    };

    return (
        <View>
            <Text>Weather:</Text>
            <FlatList
                // style={styles.list}
                data={forecasts}
                renderItem={renderWeather}
                keyExtractor={(weather, index) =>
                    weather.time.getTime().toString() + index
                }
                horizontal={true}
            />
        </View>
    );
};

export default ForecastComponent;
