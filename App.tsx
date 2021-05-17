import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from './screens/Search';
import Home from './screens/Home';

const Tab = createBottomTabNavigator();
const App = () => {
    return (
        <>
            <StatusBar backgroundColor="#00aaff" />
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({route}) => ({
                        tabBarIcon: ({focused, color, size}) => {
                            let iconName = '';

                            if (route.name === 'home') {
                                iconName = focused
                                    ? 'home-city'
                                    : 'home-city-outline';
                            } else if (route.name === 'search') {
                                iconName = focused
                                    ? 'city'
                                    : 'city-variant-outline';
                            }

                            // You can return any component that you like here!
                            return (
                                <MaterialCommunityIcons
                                    name={iconName}
                                    size={size}
                                    color={color}
                                />
                            );
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: 'white',
                        inactiveTintColor: 'black',
                        activeBackgroundColor: '#00aaff',
                        inactiveBackgroundColor: '#00aaff',
                    }}>
                    <Tab.Screen
                        name="home"
                        component={Home}
                        initialParams={{
                            cityName: 'Mumbai',
                            latitude: '20',
                            longitude: '73.78',
                        }}
                    />
                    <Tab.Screen name="search" component={Search} />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );
};

export default App;
