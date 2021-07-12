import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Location from './components/Location';
import Weather from './components/Weather/Weather';

import { location } from './service/locationService';


/**
 * A weather app that uses data from Naver.
 *
 * @export
 * @return {*} 
 */
export default function App() {

  const [currentLocation, setCurrentLocation] = useState<location | null>(null);

  const onLocationChange = (location: location) => {
    console.log(`on location change: ${JSON.stringify(location)}`);
    setCurrentLocation(location);
  }

  return (
    <View style={styles.container}>
      <Location onLocationChange={onLocationChange} />
      <Weather location={currentLocation} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
