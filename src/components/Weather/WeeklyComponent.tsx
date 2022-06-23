import { Weather, WeeklyForecast } from '../../service/weatherService';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

/**
 * A component that shows the weekly forecast.
 *
 * @param {{ weather: Weather }} props
 * @return {*}
 */
const WeeklyComponent = (props: { weather: Weather }) => {
    const { weeklyForecast } = props.weather!;

    const renderWind = (wf: WeeklyForecast) => {
        return (
            <View key={wf.morning.time.getTime()} style={styles.row}>
                <View style={styles.date}>
                    <Text style={getDayStyle(wf.morning.time.getDay())}>
                        {days[wf.morning.time.getDay()]}
                    </Text>
                    <Text  style={getDateStyle(wf.morning.time.getDay())}>
                        {wf.morning.time.getMonth()}.{wf.morning.time.getDate()}
                    </Text>
                </View>
                <View style={styles.middle}>
                    <Text style={getRainStyle(wf.morning.rainChance)}>
                        {wf.morning.rainChance}%
                    </Text>
                    <Text style={styles.condition}>{wf.morning.condition}</Text>
                    <Text style={styles.condition}>
                        {wf.afternoon.condition}
                    </Text>
                    <Text style={getRainStyle(wf.afternoon.rainChance)}>
                        {wf.afternoon.rainChance}%
                    </Text>
                </View>
                <View style={temperature.row}>
                    <Text style={temperature.cold}>
                        {wf.morning.temperature.degrees}°
                    </Text>
                    <Text style={temperature.slash}>/</Text>
                    <Text style={temperature.hot}>
                        {wf.afternoon.temperature.degrees}°
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.main}>
            {weeklyForecast.map(wf => renderWind(wf))}
        </View>
    );
};

const days = ['일', '월', '화', '수', '목', '금', '토'];

const getRainStyle = (rainChance: number) => {
    if (rainChance <= 0) {
        return rain.none;
    } else if (rainChance <= 40) {
        return rain.lowChance;
    } else if (rainChance <= 60) {
        return rain.mediumChance;
    } else {
        return rain.highChance;
    }
};

const getDayStyle = (dayOfWeek: number) => {
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return day.weekEnd;
    } else {
        return day.weekDay;
    }
};

const getDateStyle = (dayOfWeek: number) => {
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return date.weekEnd;
    } else {
        return date.weekDay;
    }
};

const rain = StyleSheet.create({
    none: {
        fontSize: 15,
        fontWeight: '400',
        color: '#e9ecf5',
    },
    lowChance: {
        fontSize: 15,
        fontWeight: '400',
        color: '#d2dbf9',
    },
    mediumChance: {
        fontSize: 15,
        fontWeight: '400',
        color: '#8f9ff0',
    },
    highChance: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6279ea',
    },
});

const day = StyleSheet.create({
    weekDay: {
        fontSize: 14,
        fontWeight: '400',
        color: '#424242',
    },
    weekEnd: {
        fontSize: 14,
        fontWeight: '400',
        color: '#ca2b1e',
    },
});

const date = StyleSheet.create({
    weekDay: {
        fontSize: 13,
        fontWeight: '400',
        color: '#b0b0b0',
    },
    weekEnd: {
        fontSize: 13,
        fontWeight: '400',
        color: '#ca2b1e',
        opacity: 0.5,
    },
});

const temperature = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hot: {
        fontWeight: '400',
        fontSize: 18,
        color: '#dc6163',
    },
    slash: {
        fontWeight: '400',
        color: '#dbdbdb',
    },
    cold: {
        fontSize: 15,
        fontWeight: '400',
        color: '#729def',
    },
});

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#cfd4d6',
        borderRadius: 8,
        borderWidth: 1,
    },
    main: {
        marginTop: 10,
    },
    date: {
        alignItems: 'center',
    },
    middle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    condition: {
        margin: 4,
    },
});

export default WeeklyComponent;
