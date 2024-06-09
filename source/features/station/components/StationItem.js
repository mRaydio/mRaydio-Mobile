import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RegularTextB, SmallText} from 'components/Text';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Colors from 'constants/Colors';

const Wrapper = ({children, item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('BroadcastScreen', item);
      }}
      style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
      {children}
    </TouchableOpacity>
  );
};
const StationItem = ({item}) => {
  const {stationName, name, picture} = item ?? {};
  return (
    <Wrapper item={item}>
      <FastImage
        source={{uri: picture}}
        style={{
          width: 70,
          height: 70,
          marginRight: 10,
          borderRadius: 5,
          backgroundColor: Colors.lightpurple,
        }}
      />
      <View>
        <RegularTextB style={{marginBottom: 4}}>{name}</RegularTextB>
        <SmallText>{stationName}</SmallText>
      </View>
    </Wrapper>
  );
};

export default StationItem;

const styles = StyleSheet.create({});
