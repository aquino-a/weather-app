import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Alert, Pressable, StyleSheet, TextInput, FlatList, ListRenderItem } from "react-native";

import locationService, { location, defaultLocation, locationKey } from '../service/locationService';
import { getValue, storeValue } from '../service/storageService';

/**
 * A component that shows the currently selected location.
 * Will open a modal to choose a location when selected.
 * Loads the last picked location from async storage.
 *
 * @return {*} 
 */
const Location = (props: locationProps) => {

    const { onLocationChange } = props;

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentLocation, setCurrentLocation] = useState<location>(defaultLocation);
    const [searchValue, setSearchValue] = useState<string>("");
    const [locations, setLocations] = useState<location[]>([]);

    useEffect(() => {
        getValue<location>(locationKey, defaultLocation)
            .then(location => {
                setCurrentLocation(location);
                console.log(`got location: ${JSON.stringify(location)}`)
            });
    }, []);

    useEffect(() => {
        onLocationChange?.(currentLocation);
    }, [currentLocation])

    const onSearchChange = async (text: string) => {

        setSearchValue(text);

        if (text.length < 2) {
            return;
        }

        setLocations(await locationService.searchLocation(text));
    }

    const renderLocation: ListRenderItem<location> = ({ item }) => {

        return (
            <Pressable
                onPress={() => {
                    setCurrentLocation(item);
                    setModalVisible(false);
                    storeValue(locationKey, item);
                }}
            >
                <View >
                    <Text>{item.name}</Text>
                </View>
            </Pressable>
        );
    }

    return (
        <View>
            <View >
                <Modal
                    style={styles.locationSelect}
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View >
                        <View >
                            <TextInput
                                // style={styles.input}
                                onChangeText={onSearchChange}
                                value={searchValue}
                                placeholder="Location"
                                keyboardType="default"
                            />
                            <FlatList
                                data={locations}
                                renderItem={renderLocation}
                                keyExtractor={location => location.code}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
            <Pressable
                onPress={() => setModalVisible(true)}
            >
                <Text>{currentLocation.name}</Text>
            </Pressable>
        </View>
    );
};






const styles = StyleSheet.create({
    locationSelect: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
    }
});

export interface locationProps {
    onLocationChange: ((location: location) => void) | null;
}

export default Location;