import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { weather } from '../../service/weatherService';



/**
 * A component that displays the current weather data.
 *
 * @param {{ weather: weather }} props
 * @return {*} 
 */
const Current = (props: { weather: weather }) => {

    const { weather } = props;

    return (
        <View style={{flex: 1}}>
            <View style={styles.temperature}>
                <Text style={styles.temperatureText}>
                    {weather!.temperature.degrees}°
                </Text>
            </View>
            {/* <Text>{weather!.condition}</Text>
            <View>
                <Text>Humidity: {weather!.humidity}%</Text>
                <Text>{weather!.windDirection} {weather!.windSpeed}m/s</Text>
                <Text>Feel: {weather!.feel.degrees}°</Text>
            </View>
            <View>
                <Text>Dust: {weather!.dust}</Text>
                <Text>Micro Dust: {weather!.microDust}</Text>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    temperature: {
        flex: 3,
        alignSelf: 'center'
    },

    temperatureText:{
        fontSize: 60,
        padding: 10,
        fontWeight: 'bold'
    }
})


export default Current;