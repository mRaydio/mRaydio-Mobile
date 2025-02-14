import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../constants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PermissionsAndroid, Platform} from 'react-native';
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import HomeScreen from 'features/bottomtabs/home/HomeScreen';
import Icon, {Icons} from 'components/Icons';
import SearchScreen from 'features/bottomtabs/search/SearchScreen';
import ProfileScreen from 'features/bottomtabs/profile/ProfileScreen';
import DiscoverScreen from 'features/bottomtabs/discover/DiscoverScreen';

export type RootStackParamList = {
  Shop: {searchPassed?: string};
};

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // async function requestUserPermission() {
  //   await messaging().requestPermission();
  // }

  async function requestPermissionAndroid() {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (err) {
      console.log(err);
    }
  }

  // const getToken = async () => {
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log('token', token);
  //     });
  // };

  // useEffect(() => {
  //   const init = async () => {
  //     if (Platform.OS === 'android') {
  //       if (Platform.Version >= 33) {
  //         await requestPermissionAndroid();
  //       }
  //     } else {
  //       await requestUserPermission();
  //     }
  //     await getToken();
  //   };
  //   init();
  // }, []);

  // useEffect(() => {
  //   return messaging().onTokenRefresh(token => {
  //     console.log('token changed', token);
  //   });
  // }, []);

  // const handleNotificationOpen = ({
  //   remoteMessage,
  // }: {
  //   remoteMessage: FirebaseMessagingTypes.RemoteMessage;
  // }) => {
  //   console.log('remoteMessage', remoteMessage.data);

  // };

  // useEffect(() => {
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log('onNotificationOpenedApp');
  //     if (remoteMessage) {
  //       handleNotificationOpen({remoteMessage});
  //     }
  //   });

  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       console.log('getInitialNotification');
  //       if (remoteMessage) {
  //         handleNotificationOpen({remoteMessage});
  //       }
  //     });
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  const screenOptions = {
    header: () => null,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: Colors.tabBlur,
    tabBarLabelStyle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 12,
    },
    tabBarStyle: {
      height: Platform.OS === 'android' ? 60 : 55 + insets.bottom,
      paddingBottom: Platform.OS === 'android' ? 5 : insets.bottom - 5,
      paddingTop: Platform.OS === 'ios' ? 5 : 0,
      backgroundColor: Colors.bg,
      borderTopWidth: 0,
    },
  };
  return (
    <Tab.Navigator backBehavior="history" screenOptions={screenOptions}>
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <Icon size={22} type={Icons.Feather} name={'home'} color={color} />
          ),
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <Icon size={22} type={Icons.Feather} name={'radio'} color={color} />
          ),
        }}
        name="Discover"
        component={DiscoverScreen}
      />
      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({color}) => (
            <Icon
              size={23}
              type={Icons.Feather}
              name={'search'}
              color={color}
            />
          ),
        }}
        component={SearchScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <Icon
              size={22}
              type={Icons.Octicons}
              name={'person'}
              color={color}
            />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
