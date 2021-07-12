import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { weatherChildProps } from './Weather';


/**
 * A component that displays the current weather data.
 *
 * @param {weatherChildProps} props
 * @return {*} 
 */
const Current = (props: weatherChildProps) => {

    const { weather } = props;

    return (
        <View>
            <Text>{weather!.temperature.degrees}°</Text>
            <Text>{weather!.condition}</Text>
            <View>
                <Text>Humidity: {weather!.humidity}%</Text>
                <Text>{weather!.windDirection} {weather!.windSpeed}m/s</Text>
                <Text>Feel: {weather!.feel.degrees}°</Text>
            </View>
            <View>
                <Text>Dust: {weather!.dust}</Text>
                <Text>Micro Dust: {weather!.microDust}</Text>
            </View>
        </View>
    );
}



export default Current;