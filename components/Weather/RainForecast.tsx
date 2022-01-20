import React from 'react';
import { ListRenderItem, View, Text, FlatList } from 'react-native';

import { RainForecast, Weather } from '../../service/weatherService';
import { baseStyle, getItemStyle } from './weatherChildren';

/**
 * A component that displays the rain forecasts.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const RainForecast = (props: { weather: Weather }) => {
    const { rainForecasts } = props.weather!;

    const renderRain: ListRenderItem<RainForecast> = ({ item }) => {
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

// const styles = StyleSheet.create({
//     list: {
//         width: 250,
//     },
// });

export default RainForecast;
