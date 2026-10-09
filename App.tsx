import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';
export default function App() { return <Provider store={store}><SafeAreaProvider><NavigationContainer><RootNavigator /></NavigationContainer></SafeAreaProvider></Provider>; }
