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
import TestScreen from '../screens/TestScreen';

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
    // tabBarInactiveTintColor: Colors.tabBlur,
    tabBarLabelStyle: {
      fontFamily: 'Gilroy-Medium',
      fontSize: 12,
    },
    tabBarStyle: {
      height: Platform.OS === 'android' ? 60 : 55 + insets.bottom,
      paddingBottom: Platform.OS === 'android' ? 5 : insets.bottom - 5,
      paddingTop: Platform.OS === 'ios' ? 5 : 0,
      // backgroundColor: Colors.tabColor,
      borderTopWidth: 0,
    },
  };
  return (
    <Tab.Navigator backBehavior="history" screenOptions={screenOptions}>
      <Tab.Screen
        options={
          {
            // tabBarIcon: ({color}) => (
            //   <ShopSvg width={23} height={23} color={color} />
            // ),
          }
        }
        name="TestScreen"
        component={TestScreen}
      />
    </Tab.Navigator>
  );
}
