import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Linking} from 'react-native';
import OnboardingScreen from 'features/auth/screens/OnboardingScreen';
import LoginScreen from 'features/auth/screens/LoginScreen';
import {getItem} from 'services/storage';
import BroadcastScreen from 'features/station/screens/BroadcastScreen';
import MyStations from 'features/station/screens/MyStations';
import CreateStation from 'features/station/screens/CreateStation';

interface DeepLinkResult {
  product_id: string;
  username?: string;
}

import AniStackNav from './AniStack';
import CreateAccountScreen from 'features/auth/screens/CreateAccountScreen';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink({url: initialUrl});
    };

    getUrlAsync();
    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  const handleDeepLink = (prop: {url: string | null} | undefined) => {
    const {url} = prop ?? {};
    if (url) {
      console.log('initialUrl', url);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={getItem('token') ? 'AniStackNav' : 'OnboardingScreen'}
      screenOptions={{
        header: () => null,
      }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
      />

      <Stack.Screen name="MyStations" component={MyStations} />
      <Stack.Screen name="CreateStation" component={CreateStation} />
      <Stack.Screen name="BroadcastScreen" component={BroadcastScreen} />

      <Stack.Screen name="AniStackNav" component={AniStackNav} />
    </Stack.Navigator>
  );
};

export default StackNav;
