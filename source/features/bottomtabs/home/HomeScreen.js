import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText, RegularText, SmallText} from 'components/Text';

const HomeScreen = () => {
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30}}>
        <MediumText>Popular Stations</MediumText>
      </View>
    </Mainbackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
