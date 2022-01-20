import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import LocationComponent from './components/Location';
import Weather from './components/Weather/Weather';

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

    const onLocationChange = (location: Location) => {
        console.log(`on location change: ${JSON.stringify(location)}`);
        setCurrentLocation(location);
    };

    return (
        <View style={styles.container}>
            <LocationComponent onLocationChange={onLocationChange} />
            <Weather location={currentLocation} />
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
});
