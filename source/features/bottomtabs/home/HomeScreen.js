import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText, RegularText, SmallText} from 'components/Text';
import Button from 'components/Button';
import CurrentStation from 'components/CurrentStation';

const HomeScreen = ({navigation}) => {
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30}}>
        <MediumText>Popular Stations</MediumText>
        <Button
          title="View Station"
          onPress={() => {
            navigation.navigate('ViewStation');
          }}
        />
      </View>
      <CurrentStation />
    </Mainbackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
