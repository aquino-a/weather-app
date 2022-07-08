import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, RefreshControl } from 'react-native';

import { weatherServiceInstance as weatherService } from '../../service/serviceFactory';
import { Location } from '../../service/locationService';
import { Weather } from '../../service/weatherService';

import WeeklyComponent from './WeeklyComponent';
import TodayComponent from './TodayComponent';

/**
 * The parent component of all weather child components.
 *
 * @param {{ location: Location }} props
 * @return {*}
 */
const WeatherComponent = (props: {
    location: Location;
    currentView: CurrentView;
}) => {
    const { location, currentView } = props;

    const [weather, setWeather] = useState<Weather | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const searchWeather = async () => {
        try {
            const foundWeather = await weatherService.searchWeather(
                location!.code
            );
            setWeather(foundWeather);
        } catch (error) {
            console.log('weather result in wrong format');
            console.log(error);
            Alert.alert('Data unavailable.', 'Choose different location.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await searchWeather();
        setRefreshing(false);
    };

    useEffect(() => {
        if (!location || location.code === '') {
            return;
        }
        searchWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    if (!location || location.code === '') {
        return (
            <View>
                <Text>Choose Location.</Text>
            </View>
        );
    }

    if (!weather) {
        return (
            <View>
                <Text>Loading..</Text>
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {currentView === CurrentView.Today ? (
                <TodayComponent weather={weather} />
            ) : null}
            {currentView === CurrentView.Weekly ? (
                <WeeklyComponent weather={weather} />
            ) : null}
        </ScrollView>
    );
};

export enum CurrentView {
    Today,
    Weekly,
}

// const styles = StyleSheet.create({
//     mainView: {
//         flex: 1,
//     },
//     current: {
//         flex: 1,
//     },
// });

export default WeatherComponent;
