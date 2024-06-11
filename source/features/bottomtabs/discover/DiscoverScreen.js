import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText} from 'components/Text';
import CurrentStation from 'components/CurrentStation';

const DiscoverScreen = () => {
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30}}>
        <MediumText>Discover</MediumText>
      </View>
      <CurrentStation />
    </Mainbackground>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({});
