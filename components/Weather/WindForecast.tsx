import React from 'react';
import { ListRenderItem, View, Text, FlatList } from 'react-native';

import { Weather, WindForecast } from '../../service/weatherService';
import { baseStyle, getItemStyle } from './weatherChildren';

/**
 * A component that displays the wind forecasts.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const WindForecastComponent = (props: { weather: Weather }) => {
    const { windForecasts } = props.weather!;

    const renderWind: ListRenderItem<WindForecast> = ({ item }) => {
        return (
            <View style={[getItemStyle(item.time), baseStyle]}>
                <Text>{item.time.getHours()}</Text>
                <Text>{item.direction}</Text>
                <Text>{item.speed}m/s</Text>
            </View>
        );
    };

    return (
        <View>
            <Text>Wind:</Text>
            <FlatList
                // style={styles.list}
                data={windForecasts}
                renderItem={renderWind}
                keyExtractor={(wind, index) =>
                    wind.time.getTime().toString() + index
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

export default WindForecastComponent;
