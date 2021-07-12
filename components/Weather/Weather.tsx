import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import Current from './Current';
import HumidityForecast from './HumidityForecast';
import RainForecast from './RainForecast';
import WeatherForecast from './WeatherForecast';
import WindForecast from './WindForecast';


export const Weather = () => {
    return (
        <View>
            <Current />
            <WeatherForecast />
            <HumidityForecast />
            <RainForecast />
            <WindForecast />
        </View>
    );
}

export default Weather;