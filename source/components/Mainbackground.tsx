import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DeviceEventEmitter} from 'react-native';
import Colors from '../constants/Colors';

interface MainBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  keyboard?: boolean;
  avoid?: boolean;
  top?: number;
  padding?: number;
  paddingBottom?: number;
  insetsBottom?: number;
  androidAvoid?: 'padding' | 'height' | 'position';
}

const Mainbackground: React.FC<MainBackgroundProps> = ({
  children,
  style,
  keyboard,
  avoid,
  top,
  padding,
  paddingBottom,
  insetsBottom,
  androidAvoid,
}) => {
  const insets = useSafeAreaInsets();
  const [noti, setNoti] = useState(false);
  useEffect(() => {
    const myEventListener = DeviceEventEmitter.addListener(
      'openNotification',
      event => {
        setNoti(true);
        setTimeout(() => {
          setNoti(false);
        }, 3500);
      },
    );

    return () => myEventListener.remove();
  }, []);
  return (
    <Pressable
      disabled={!keyboard}
      onPress={() => Keyboard.dismiss()}
      style={{
        flex: 1,
        backgroundColor: Colors.bg,
        padding,
        paddingBottom,
      }}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={-insets.bottom}
        behavior={avoid && Platform.OS === 'ios' ? 'padding' : androidAvoid}
        style={{
          flex: 1,

          paddingTop: noti ? 0 : top ? top : insets.top,
        }}>
        <View
          style={{
            flex: 1,
            paddingBottom: insetsBottom ? insetsBottom : insets.bottom,
            ...style,
          }}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
};

export default Mainbackground;

const styles = StyleSheet.create({});
