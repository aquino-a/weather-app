import { Weather } from '../../service/weatherService';
import { View, StyleSheet } from 'react-native';
import React from 'react';
import Current from './Current';
import ForecastComponent from './Forecast';

const TodayComponent = (props: { weather: Weather }) => {
    const weather = props.weather!;

    return (
        <View>
            <Current weather={weather} />
            <View style={styles.childContainer}>
                <ForecastComponent weather={weather} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    childContainer: {
        flex: 1,
        maxWidth: 400,
    },
});

export default TodayComponent;
