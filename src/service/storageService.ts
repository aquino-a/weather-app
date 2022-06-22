import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeValue = async (key: string, value: any) => {
    try {
        console.log(`saving ${JSON.stringify(value)}`);
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // saving error
        console.log(`Error saving value: ${JSON.stringify(value)}`);
        console.log(e);
    }
};

export const getValue = async function <T>(
    key: string,
    defaultValue: T
): Promise<T> {
    try {
        const savedValue = await AsyncStorage.getItem(key);
        if (savedValue !== null) {
            return JSON.parse(savedValue) as T;
        } else {
            console.log(`nothing found for key ${key}`);
            return defaultValue;
        }
    } catch (e) {
        // error reading value
        console.log(`Error reading saved value: ${key}`);
        console.log(e);
        return defaultValue;
    }
};
