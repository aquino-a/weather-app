import React from 'react';
import { FlatList, ListRenderItem, View, Text } from 'react-native';

import { HumidityForecast, Weather } from '../../service/weatherService';
import { baseStyle, getItemStyle } from './weatherChildren';

/**
 * A component that displays the humidity forecast.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const HumidityForecast = (props: { weather: Weather }) => {
    const { humidityForecasts } = props.weather!;

    const renderHumidity: ListRenderItem<HumidityForecast> = ({ item }) => {
        return (
            <View style={[getItemStyle(item.time), baseStyle]}>
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

// const styles = StyleSheet.create({
//     list: {
//         width: 250,
//     },
// });

export default HumidityForecast;
