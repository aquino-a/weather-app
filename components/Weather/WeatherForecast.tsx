import React from 'react';
import { ListRenderItem, View, Text, FlatList } from 'react-native';

import { Weather, WeatherForecast } from '../../service/weatherService';
import { baseStyle, getItemStyle } from './weatherChildren';

/**
 * A component that displays the weather forecasts.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const WeatherForecastComponent = (props: { weather: Weather }) => {
    const { weatherForecasts } = props.weather!;

    const renderWeather: ListRenderItem<WeatherForecast> = ({ item }) => {
        return (
            <View style={[getItemStyle(item.time), baseStyle]}>
                <Text>{item.time.getHours()}</Text>
                <Text>{item.condition}</Text>
                <Text>{item.temperature.degrees}°</Text>
            </View>
        );
    };

    return (
        <View>
            <Text>Weather:</Text>
            <FlatList
                // style={styles.list}
                data={weatherForecasts}
                renderItem={renderWeather}
                keyExtractor={(weather, index) =>
                    weather.time.getTime().toString() + index
                }
                horizontal={true}
            />
        </View>
    );
};

export default WeatherForecastComponent;
