import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';

import LocationComponent from './components/Location';
import WeatherComponent, { CurrentView } from './components/Weather/Weather';

import { Location } from './service/locationService';

/**
 * A weather app that uses data from Naver.
 *
 * @export
 * @return {*}
 */
export default function App() {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(
        null
    );
    const [currentView, setCurrentView] = useState<CurrentView>(
        CurrentView.Today
    );

    const onLocationChange = (location: Location) => {
        console.log(`on location change: ${JSON.stringify(location)}`);
        setCurrentLocation(location);
    };

    const changeView = () => {
        if (currentView === CurrentView.Today) {
            setCurrentView(CurrentView.Weekly);
        } else {
            setCurrentView(CurrentView.Today);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <LocationComponent onLocationChange={onLocationChange} />
                <Pressable style={styles.viewPress} onPress={changeView}>
                    <Text style={styles.viewButton}>
                        {CurrentView[currentView]}
                    </Text>
                </Pressable>
            </View>
            <View style={styles.weather}>
                <WeatherComponent
                    location={currentLocation}
                    currentView={currentView}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    topRow: {
        flexDirection: 'row',
    },
    viewPress: {
        justifyContent: 'center',
    },
    viewButton: {
        borderRadius: 13,
        backgroundColor: 'honeydew',
        alignSelf: 'center',
        paddingHorizontal: 13,
        paddingVertical: 7,
        marginHorizontal: 10,
    },
    weather: {
        width: Dimensions.get('window').width,
        padding: 10,
    },
});
