import React, { useState, useEffect } from 'react';
import { ListRenderItem, View, Text, FlatList, StyleSheet } from 'react-native';
import { windForecast } from '../../service/weatherService';

import { weatherChildProps } from './Weather';


const WindForecast = (props: weatherChildProps) => {

    const { windForecasts } = props.weather!;

    const renderWind: ListRenderItem<windForecast> = ({ item }) => {
        return (
            <View >
                <Text>{item.time.getHours()}</Text>
                <Text>{item.direction}</Text>
                <Text>{item.speed}m/s</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>
                Wind:
            </Text>
            <FlatList
                style={styles.list}
                data={windForecasts}
                renderItem={renderWind}
                keyExtractor={(wind, index) => wind.time.getTime().toString() + index}
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


export default WindForecast;