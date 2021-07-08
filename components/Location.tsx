import React, { useState } from 'react';
import { View, Text, Modal, Alert, Pressable, StyleSheet, TextInput, FlatList, ListRenderItem } from "react-native";

import locationService, { location } from '../service/locationService';

const Location = () => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentLocation, setCurrentLocation] = useState<location>({ name: "Set Location", code: "" });
    const [searchValue, setSearchValue] = useState<string>("");
    const [locations, setLocations] = useState<location[]>([{name:"hello", code: "1111"}]);

    const onSearchChange = async (text: string) => {

        setSearchValue(text);

        if (text.length < 2) {
            return;
        }

        setLocations(await locationService.searchLocation(text));
    }

    const renderLocation: ListRenderItem<location> = ({item}) => {
        return (
            <View >
                <Text>{item.name}</Text>
            </View>
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

export default Location;