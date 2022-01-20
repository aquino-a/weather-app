import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    FlatList,
    ListRenderItem,
} from 'react-native';

import { locationServiceInstance as locationService } from '../service/serviceFactory';
import {
    Location,
    defaultLocation,
    locationKey,
} from '../service/locationService';
import { getValue, storeValue } from '../service/storageService';

/**
 * A component that shows the currently selected location.
 * Will open a modal to choose a location when selected.
 * Loads the last picked location from async storage.
 *
 * @return {*}
 */
const LocationComponent = (props: {
    onLocationChange: (location: Location) => void;
}) => {
    const { onLocationChange } = props;

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentLocation, setCurrentLocation] =
        useState<Location>(defaultLocation);
    const [searchValue, setSearchValue] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        getValue<Location>(locationKey, defaultLocation).then(location => {
            setCurrentLocation(location);
            console.log(`got location: ${JSON.stringify(location)}`);
        });
    }, []);

    useEffect(() => {
        onLocationChange?.(currentLocation);
    }, [currentLocation, onLocationChange]);

    const onSearchChange = async (text: string) => {
        setSearchValue(text);

        if (text.length < 2) {
            return;
        }

        setLocations(await locationService.searchLocation(text));
    };

    const renderLocation: ListRenderItem<Location> = ({ item }) => {
        return (
            <Pressable
                onPress={() => {
                    setCurrentLocation(item);
                    setModalVisible(false);
                    storeValue(locationKey, item);
                }}
            >
                <View>
                    <Text>{item.name}</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <View>
            <View>
                <Modal
                    // style={styles.locationSelect}
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TextInput
                                style={styles.locationInput}
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
                onPress={() => {
                    console.log('location clicked');
                    setModalVisible(true);
                }}
            >
                <View style={styles.locationView}>
                    <Text>{currentLocation.name}</Text>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    locationView: {
        borderRadius: 13,
        backgroundColor: '#fafbee',
        paddingHorizontal: 55,
        paddingVertical: 7,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    locationInput: {
        padding: 5,
        fontSize: 30,
    },
});

export default LocationComponent;
