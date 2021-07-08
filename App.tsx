import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Location from './components/Location';
// import { location, defaultLocation, locationKey } from './service/locationService';
// import { getValue } from './service/storageService';



export default function App() {
  return (
    <View style={styles.container}>
      <Location />
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
