import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {RegularText, RegularTextB, SmallText} from './Text';
import {getPercentWidth} from 'utilis/helper_functions';
import {useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import {useCurrentStation} from 'services/store';
import {useRoomContext} from '@livekit/react-native';

export const StationNavigator = ({children, item}) => {
  const {name, picture, stationName} = item ?? {};
  const navigation = useNavigation();
  const setCurrentStation = useCurrentStation(state => state.setCurrentStation);
  const setStationName = useCurrentStation(state => state.setStationName);
  const room = useRoomContext();
  return (
    <TouchableOpacity
      onPress={() => {
        room.disconnect();
        setStationName(stationName);
        setCurrentStation({name, picture, stationName});
        navigation.navigate('ViewStation');
      }}>
      {children}
    </TouchableOpacity>
  );
};
const StationCard = ({item}) => {
  const {name, picture, stationName} = item ?? {};
  return (
    <StationNavigator item={item}>
      <View style={{width: getPercentWidth(50), marginRight: 15}}>
        <SharedElement id={`station_image_${stationName}`}>
          <FastImage
            source={{uri: picture}}
            style={{width: '100%', height: 150, marginBottom: 5}}
          />
        </SharedElement>
        <SharedElement id={`station_name_${stationName}`}>
          <RegularText style={{marginBottom: 5, fontSize: 15}}>
            {name}
          </RegularText>
        </SharedElement>
        <SharedElement id={`station_stationName_${stationName}`}>
          <SmallText dim>{stationName}</SmallText>
        </SharedElement>
      </View>
    </StationNavigator>
  );
};

export default StationCard;

const styles = StyleSheet.create({});
