import {
  Animated,
  LogBox,
  Platform,
  StatusBar,
  UIManager,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Notification from './source/components/Notification';
import {NavigationContainer} from '@react-navigation/native';
import StackNav from './source/navigation/StackNav';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {clientPersister} from 'services/storage';
import TrackPlayer from 'react-native-track-player';
import {LiveKitRoom} from '@livekit/react-native';
import {LIVEKIT_URL} from '@env';
import {useCurrentStation} from 'services/store';
import {requestExternalStoragePermission} from 'utilis/helper_functions';

if (Platform.OS === 'android') {
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setTranslucent(true);
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

LogBox.ignoreAllLogs();
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

const App = () => {
  const transY = useRef(new Animated.Value(0)).current;
  const goDown = ({num = 128}) => {
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: num,
    }).start();
  };

  const goUp = () => {
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: 0,
    }).start();
  };

  const token = useCurrentStation(state => state.token);
  useEffect(() => {
    // requestExternalStoragePermission();
    const init = async () => {
      await TrackPlayer.setupPlayer();
    };
    init();
  }, []);

  const onReady = () => {
    // BootSplash.hide();
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister: clientPersister}}>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}>
        <SafeAreaProvider>
          <Notification {...{goDown, goUp}} />
          <Animated.View
            style={{
              flex: 1,
              transform: [{translateY: transY}],
            }}>
            <NavigationContainer onReady={onReady}>
              <LiveKitRoom
                connect={!!token}
                serverUrl={LIVEKIT_URL}
                token={token}
                audio={false}
                video={false}>
                <StackNav />
              </LiveKitRoom>
            </NavigationContainer>
          </Animated.View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
};

export default App;
