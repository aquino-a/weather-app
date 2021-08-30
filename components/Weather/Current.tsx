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

    const dustStyle = (dust: string) => {
        switch (dust) {
            case '좋음':
                return goodDust;
            case '보통':
                return okDust;
            case '높음':
                return badDust;
            case '매우높음':
            default:
                return veryBadDust;
        }
    };

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
                <Text style={styles.miscDetailsLabel}>
                    {weather!.windDirection}{' '}
                </Text>
                <Text style={styles.miscDetailsData}>
                    {weather!.windSpeed}m/s
                </Text>
                <Text style={styles.separator}>~</Text>
                <Text style={styles.miscDetailsLabel}>Feel</Text>
                <Text style={styles.miscDetailsData}>
                    {weather!.feel.degrees}°
                </Text>
            </View>
            {weather.rainAmount > 0 && (
                <View style={styles.rain}>
                    <Text style={styles.rainLabel}>Rain: </Text>
                    <Text style={styles.rainData}>{weather.rainAmount}mm</Text>
                </View>
            )}
            <View style={styles.dust}>
                <View style={[styles.dustBox, dustStyle(weather.dust).dustBox]}>
                    <Text>Dust</Text>
                    <Text
                        style={[
                            styles.dustData,
                            dustStyle(weather.dust).dustData,
                        ]}
                    >
                        {weather!.dust}
                    </Text>
                </View>
                <View
                    style={[
                        styles.dustBox,
                        dustStyle(weather.microDust).dustBox,
                    ]}
                >
                    <Text>Micro Dust</Text>
                    <Text
                        style={[
                            styles.dustData,
                            dustStyle(weather.microDust).dustData,
                        ]}
                    >
                        {weather!.microDust}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    currentView: {
        flex: 2,
        alignItems: 'center',
    },
    temperature: {
        backgroundColor: 'transparent',
    },
    temperatureText: {
        fontSize: 90,
        padding: 0,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    condition: {
        flex: 1.75,
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    miscDetails: {
        flex: 0.5,
        flexDirection: 'row',
    },
    miscDetailsLabel: {
        fontSize: 14,
        color: 'gray',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 2,
    },
    miscDetailsData: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 2,
    },
    rain: {
        flex: 1,
        flexDirection: 'row',
        padding: 3,
    },
    rainLabel: {
        fontSize: 14,
        color: 'gray',
        textAlignVertical: 'center',
    },
    rainData: {
        fontSize: 16,
        color: '#32a1ff',
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    dust: {
        flex: 0.75,
        flexDirection: 'row',
    },
    dustBox: {
        alignItems: 'center',
        margin: 2,
        paddingHorizontal: 2,
        paddingVertical: 1,
        borderRadius: 4,
        backgroundColor: '#eef6fb',
        width: 100,
        justifyContent: 'center',
    },
    dustData: {
        color: '#32a1ff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    separator: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 2,
    },
});

const goodDust = StyleSheet.create({
    dustBox: {
        backgroundColor: '#eef6fb',
    },
    dustData: {
        color: '#32a1ff',
    },
});
const okDust = StyleSheet.create({
    dustBox: {
        backgroundColor: '#eef9ec',
    },
    dustData: {
        color: '#00c73c',
    },
});
const badDust = StyleSheet.create({
    dustBox: {
        backgroundColor: '#fdfbef',
    },
    dustData: {
        color: '#fda915',
    },
});
const veryBadDust = StyleSheet.create({
    dustBox: {
        backgroundColor: '#faf6ec',
    },
    dustData: {
        color: '#f70',
    },
});

export default Current;
