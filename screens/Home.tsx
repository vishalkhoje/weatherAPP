import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ViewStyle, Alert} from 'react-native';
import {Card, Title} from 'react-native-paper';
import {RouteProp} from '@react-navigation/native';
import {SvgCssUri} from 'react-native-svg';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_KEY, WEATHER_INFO_URL, WEATHER_ICON_URL} from '@env';

type CityItems = {
    cityData: {
        cityData: object;
        cityName: string;
        lattitude: string;
        longitude: string;
    };
};

type HomeScreenRouteProp = RouteProp<CityItems, 'cityData'>;

type Props = {
    route: HomeScreenRouteProp;
};

interface Style {
    card: ViewStyle;
    imagView: ViewStyle;
    title: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    card: {
        margin: 2,
        padding: 12,
    },
    imagView: {
        alignItems: 'center',
    },
    title: {
        padding: 14,
    },
});

export interface WeatherInfo {
    fahrenheit: string;
    celsius: string;
    humidity: string;
    conditions: string;
    infoIcon: string;
}

const Home = ({route}: Props) => {
    const [weatherInfo, setWeratherInfo] = useState<WeatherInfo>({
        fahrenheit: '',
        celsius: '',
        humidity: '',
        conditions: '',
        infoIcon: '29',
    });

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('cityData');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
            console.warn(e);
        }
    };

    const getWeatherReport = (cityData: any) => {
        const urlApi = `${WEATHER_INFO_URL}?apiKey=${API_KEY}&geocodes=${cityData.lattitude},${cityData.longitude}&language=en-US&units=e&format=json`;

        fetch(urlApi)
            .then(items => items.json())
            .then(cityReportData => {
                if (cityReportData.length > 0) {
                    const reportInfo =
                        cityReportData[0]['v3-wx-observations-current'];
                    const celsius = Math.round(
                        ((reportInfo.temperature - 32) * 5) / 9,
                    );
                    setWeratherInfo({
                        infoIcon: reportInfo.iconCode,
                        fahrenheit: reportInfo.temperature,
                        celsius: `${celsius}`,
                        humidity: reportInfo.relativeHumidity,
                        conditions: reportInfo.cloudCoverPhrase,
                    });
                }
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    };

    useEffect(() => {
        getData().then(cityData => {
            getWeatherReport(cityData ? cityData : route.params);
        });
    }, [route.params]);

    return (
        <View>
            <Header title="Weather Report" />

            <View style={styles.imagView}>
                <Title style={styles.title}>{route.params.cityName}</Title>
                <SvgCssUri
                    width="40%"
                    height="40%"
                    uri={`${WEATHER_ICON_URL}${weatherInfo.infoIcon}.svg`}
                />
            </View>
            <Card style={styles.card}>
                <Text>
                    <Title>
                        Temperature - {weatherInfo.fahrenheit}&deg;F ,{' '}
                        {weatherInfo.celsius}&deg;C
                    </Title>
                </Text>
            </Card>
            <Card style={styles.card}>
                <Title>
                    <Text>Humidity - {weatherInfo.humidity}%</Text>
                </Title>
            </Card>
            <Card style={styles.card}>
                <Title>
                    <Text>Conditions - {weatherInfo.conditions}</Text>
                </Title>
            </Card>
        </View>
    );
};

export default Home;
