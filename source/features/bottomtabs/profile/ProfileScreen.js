import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText} from 'components/Text';

const ProfileScreen = () => {
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30}}>
        <MediumText>My Profile</MediumText>
      </View>
    </Mainbackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
