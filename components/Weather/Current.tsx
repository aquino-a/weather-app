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
        <View style={styles.currentView}>
            <View style={styles.temperature}>
                <Text style={styles.temperatureText}>
                    {weather!.temperature.degrees}°
                </Text>
            </View>
            <Text style={styles.condition}>{weather!.condition}</Text>
            <View style={styles.miscDetails}>
                <Text style={styles.miscDetailsLabel}>Humidity</Text>
                <Text style={styles.miscDetailsData}>{weather!.humidity}%</Text>
                <Text style={styles.separator}>~</Text>
                <Text style={styles.miscDetailsLabel}>{weather!.windDirection} </Text>
                <Text style={styles.miscDetailsData}>{weather!.windSpeed}m/s</Text>
                <Text style={styles.separator}>~</Text>
                <Text style={styles.miscDetailsLabel}>Feel</Text>
                <Text style={styles.miscDetailsData}>{weather!.feel.degrees}°</Text>
            </View>
            <View style={styles.dust}>
                <View style={styles.dustBox}>
                    <Text>Dust</Text>
                    <Text style={styles.dustData}>{weather!.dust}</Text>
                </View>
                <View style={styles.dustBox}>
                    <Text>Micro Dust</Text>
                    <Text style={styles.dustData}>{weather!.microDust}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    currentView: {
        flex: 2,
        alignItems: 'center'
    },
    temperature: {
        flex: 1,
    },
    temperatureText: {
        fontSize: 60,
        padding: 10,
        fontWeight: 'bold'
    },
    condition: {
        flex: 1,
        textAlignVertical: 'bottom',
        alignSelf: 'center',
    },
    miscDetails: {
        flex: 1,
        flexDirection: 'row',
    },
    miscDetailsLabel: {
        fontSize: 12,
        color: 'gray',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 2
    },
    miscDetailsData: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 2,
    },
    dust: {
        flex: 1,
        flexDirection: 'row',
    },
    dustBox: {
        alignItems: 'center',
        margin: 2,
        paddingHorizontal: 2,
        paddingVertical: 0,
        borderRadius: 4,
        backgroundColor: '#eef6fb',
        width: 100,
        justifyContent: 'center'
    },
    dustData: {
        color: '#32a1ff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    separator:{
        fontSize: 12,
        color: 'green',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 2,
    }

});


export default Current;