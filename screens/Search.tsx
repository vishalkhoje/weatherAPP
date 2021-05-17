import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, Alert, TouchableOpacity} from 'react-native';
import {TextInput, Button, Card} from 'react-native-paper';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_KEY, API_SEARCH_URL} from '@env';
import {debounce} from '../utils/utilities';

// TODO to add here debouncing for calling API
export interface CityItems {
    cityName: string;
    lattitude: string;
    longitude: string;
}

type CallbackType = (...args: string[]) => void;

const Search = ({navigation}: {navigation: any}) => {
    const [city, setCity] = useState('');
    const [cities, setCities] = useState<CityItems[]>([]);
    const storeData = async (value: CityItems) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('cityData', jsonValue);
        } catch (e) {
            // saving error
            console.warn(e);
        }
    };

    const fetchCities = (cityText: string) => {
        fetch(
            API_SEARCH_URL +
                API_KEY +
                '&language=en-US&query=' +
                cityText +
                '&locationType=city,postCode&format=json',
        )
            .then(item => item.json())
            .then(cityData => {
                if (cityData.errors && cityData.errors[0]) {
                    console.warn(cityData.errors[0].error.message);
                    return false;
                }
                const arrLat = cityData.location.latitude;
                const arrLong = cityData.location.longitude;
                const arrCity = cityData.location.address;

                const arrFormatedCityData = arrCity.map(
                    (cityName: string, index: number) => {
                        let objFormated = {
                            cityName: '',
                            lattitude: '',
                            longitude: '',
                        };
                        objFormated.cityName = cityName;
                        objFormated.lattitude = arrLat[index];
                        objFormated.longitude = arrLong[index];
                        return objFormated;
                    },
                );

                setCities(arrFormatedCityData);
            })
            .catch(_error => {
                Alert.alert(_error);
            });
    };

    const handleCityName = (cityText: string) => {
        if (!cityText) {
            setCity('');
            Alert.alert('Please add city name!');
            return false;
        }
        setCity(cityText);
        debouncedSave(cityText);
    };

    const handleClearButton = () => {
        setCity('');
        setCities([]);
    };

    const cityListClick = async (cityData: CityItems) => {
        setCity(cityData.cityName);
        await storeData(cityData);
        navigation.navigate('home', cityData);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
        debounce((nextValue: string) => fetchCities(nextValue), 300),
        [], // will be created only once initially
    );

    const _listEmptyComponent = () => {
        return (
            <View style={{alignItems: 'center'}}>
                <Text>No City found!</Text>
            </View>
        );
    };

    return (
        <View style={{marginBottom: 10, flex: 1}}>
            <Header title="Serarch City" />
            <TextInput
                label="City"
                theme={{colors: {primary: '#00aaff'}}}
                value={city}
                onChangeText={text => handleCityName(text)}
            />
            <Button
                icon="content-save"
                mode="contained"
                style={{margin: 20}}
                theme={{colors: {primary: '#00aaff'}}}
                onPress={() => handleClearButton()}>
                <Text style={{color: 'white'}}>Clear</Text>
            </Button>
            <FlatList
                data={cities}
                keyExtractor={item => item.cityName}
                renderItem={({item}) => {
                    const backgroundColor =
                        item.cityName === city ? '#87CEFA' : 'white';
                    return (
                        <TouchableOpacity onPress={() => cityListClick(item)}>
                            <Card
                                style={{
                                    margin: 3,
                                    padding: 20,
                                    backgroundColor: backgroundColor,
                                }}>
                                <Text>{item.cityName}</Text>
                            </Card>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={_listEmptyComponent}
            />
        </View>
    );
};

export default Search;
