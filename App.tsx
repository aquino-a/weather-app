import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Location from './components/Location';



export default function App() {
  return (
    <View style={styles.container}>
      <Location onLocationChange={l => console.log(`on location change: ${JSON.stringify(l)}`)}/>
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
