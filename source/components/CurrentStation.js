import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {RegularText, SmallText} from './Text';
import {useCurrentStation} from 'services/store';
import FastImage from 'react-native-fast-image';
import Colors from 'constants/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon, {Icons} from './Icons';
import {useRoomContext} from '@livekit/react-native';
import TrackPlayer from 'react-native-track-player';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';

const CurrentStation = () => {
  const [show, setShow] = useState(true);
  const room = useRoomContext();
  const currentStation = useCurrentStation(state => state.currentStation);
  const setCurrentStation = useCurrentStation(state => state.setCurrentStation);

  const {name, stationName, picture} = currentStation ?? {};
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      setShow(room.state === 'connected');
      console.log('sta', room.state);
    }, []),
  );

  return stationName && show ? (
    <Pressable
      onPress={() => {
        navigation.navigate('ViewStation');
      }}
      style={{
        backgroundColor: '#4C52AF90',
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        height: 65,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingRight: 15,
      }}>
      <Animated.Image
        sharedTransitionTag="tag"
        source={{uri: picture}}
        style={{
          width: 50,
          height: 50,
          marginRight: 10,
          borderRadius: 5,
          backgroundColor: Colors.bg,
        }}
      />
      <View style={{flex: 1}}>
        <RegularText style={{fontSize: 15, marginBottom: 3}}>
          {name}
        </RegularText>
        <SmallText>{stationName}</SmallText>
      </View>
      <TouchableOpacity
        onPress={() => {
          room.disconnect();
          TrackPlayer.reset();
          setCurrentStation({});
        }}>
        <Icon type={Icons.Entypo} name={'controller-stop'} color={'white'} />
      </TouchableOpacity>
    </Pressable>
  ) : null;
};

export default CurrentStation;

const styles = StyleSheet.create({});
