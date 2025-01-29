/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import MainNavigation from './src/navigation';
import {UserContext} from './src/context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    //  AsyncStorage.clear()
    SplashScreen.hide();
  }, []);

  return (
    <UserContext>
      <NativeBaseProvider>
        <MainNavigation />
      </NativeBaseProvider>
    </UserContext>
  );
};
export default App;
