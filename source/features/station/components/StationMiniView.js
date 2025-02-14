import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {BigText, RegularText} from 'components/Text';
import Colors from 'constants/Colors';

const StationMiniView = ({name, stationName, picture}) => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30}}>
      <FastImage
        source={{uri: picture}}
        style={{
          backgroundColor: Colors.lightpurple,
          height: 70,
          width: 70,
          borderRadius: 10,
          marginRight: 15,
        }}
      />
      <View>
        <BigText style={{fontSize: 30}}>{stationName}</BigText>
        <RegularText style={{fontSize: 17}} dim>
          {name}
        </RegularText>
      </View>
    </View>
  );
};

export default StationMiniView;

const styles = StyleSheet.create({});
