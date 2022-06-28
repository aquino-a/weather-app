import React from 'react';
import { ListRenderItem, View, Text, FlatList, StyleSheet } from 'react-native';

import { Forecast, Weather } from '../../service/weatherService';
import { getRainStyle } from './WeeklyComponent';

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
            <View style={[getBackColor(item.time), styles.base]}>
                <Text style={[getForeColor(item.time), time.base]}>
                    {item.time.getHours()}시
                </Text>
                <Text>{item.condition}</Text>
                <Text style={[styles.temp, time.base]}>
                    {item.temperature.degrees}°
                </Text>
                {item.percentChance === 0 ? (
                    <View>
                        <Text style={getRainStyle(0)}>-</Text>
                        <Text style={getRainStyle(0)}>-</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={getRainStyle(item.percentChance)}>
                            {item.percentChance}%
                        </Text>
                        <Text style={getRainStyle(item.percentChance)}>
                            {item.amount}mm
                        </Text>
                    </View>
                )}

                <Text style={humid.base}>{item.humidity}%</Text>
                <Text style={wind.base}>{item.direction}</Text>
                <Text style={wind.base}>{item.speed}m/s</Text>
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

const getBackColor = (date: Date): { backgroundColor: string } => {
    return getTemporalStyle(
        date,
        backgrounds.today,
        backgrounds.tomorrow,
        backgrounds.tomorrowTomorrow
    );
};

const getForeColor = (date: Date): { backgroundColor: string } => {
    return getTemporalStyle(
        date,
        time.today,
        time.tomorrow,
        time.tomorrowTomorrow
    );
};

const getTemporalStyle = (
    date: Date,
    todayStyle: any,
    tomorrowStyle: any,
    tomorrowTomorrowStyle: any
) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowTomorrow = new Date();
    tomorrowTomorrow.setDate(today.getDate() + 2);

    if (date.getDate() === today.getDate()) {
        return todayStyle;
    } else if (date.getDate() === tomorrow.getDate()) {
        return tomorrowStyle;
    } else if (date.getDate() === tomorrowTomorrow.getDate()) {
        return tomorrowTomorrowStyle;
    } else {
        return todayStyle;
    }
};

const backgrounds = StyleSheet.create({
    today: {
        backgroundColor: 'transparent',
    },
    tomorrow: {
        backgroundColor: 'ivory',
    },
    tomorrowTomorrow: {
        backgroundColor: 'snow',
    },
});

const time = StyleSheet.create({
    base: {
        fontWeight: '700',
        fontSize: 12,
    },
    today: {
        color: '#bcbcbc',
    },
    tomorrow: {
        color: '#7a59f1',
    },
    tomorrowTomorrow: {
        color: '#45c1e0',
    },
});

const wind = StyleSheet.create({
    base: {
        fontSize: 14,
        color: '#407dd0',
    },
});

const humid = StyleSheet.create({
    base: wind.base,
});

const styles = StyleSheet.create({
    base: {
        paddingHorizontal: 2,
        alignItems: 'center',
    },
    temp: {
        color: '#232323',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default ForecastComponent;
