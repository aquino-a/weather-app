import { Weather, WeeklyForecast } from '../../service/weatherService';
import { FlatList, ListRenderItem, View, Text, StyleSheet } from 'react-native';
import React from 'react';

/**
 * A component that shows the weekly forecast.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const WeeklyComponent = (props: { weather: Weather }) => {
    const { weeklyForecast } = props.weather!;

    const renderWind: ListRenderItem<WeeklyForecast> = ({ item }) => {
        return (
            <View style={styles.row}>
                <Text>
                    {item.morning.time.getMonth()}.{item.morning.time.getDate()}
                </Text>
                <Text>{item.morning.rainChance}%</Text>
                <Text>{item.morning.condition}</Text>
                <Text>{item.afternoon.rainChance}%</Text>
                <Text>{item.afternoon.condition}</Text>
                <Text>{item.morning.temperature.degrees}°</Text>
                <Text>/</Text>
                <Text>{item.afternoon.temperature.degrees}°</Text>
            </View>
        );
    };

    return (
        <View>
            <Text>Weekly:</Text>
            <FlatList
                // style={styles.list}
                data={weeklyForecast}
                renderItem={renderWind}
                keyExtractor={(week, index) =>
                    week.morning.time.getTime().toString() + index
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
    },
});
export default WeeklyComponent;
