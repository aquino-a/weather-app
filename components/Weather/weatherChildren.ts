import { StyleSheet } from 'react-native';

export const getItemStyle = (time: Date): { backgroundColor: string } => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowTomorrow = new Date();
    tomorrowTomorrow.setDate(today.getDate() + 2);

    if (time.getDate() === today.getDate()) {
        return styles.today;
    } else if (time.getDate() === tomorrow.getDate()) {
        return styles.tomorrow;
    } else if (time.getDate() === tomorrowTomorrow.getDate()) {
        return styles.tomorrowTomorrow;
    } else {
        return styles.today;
    }
};

const styles = StyleSheet.create({
    today: {
        backgroundColor: 'transparent',
    },
    tomorrow: {
        backgroundColor: 'ivory',
    },
    tomorrowTomorrow: {
        backgroundColor: 'snow',
    },
});
