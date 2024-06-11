import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText, RegularTextB, SmallText} from 'components/Text';
import ProfilePic from 'components/ProfilePic';
import Colors from 'constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {getItem} from 'services/storage';
import CurrentStation from 'components/CurrentStation';

const heartimg = require('images/profile/heart.png');
const radioimg = require('images/profile/radio.png');

const ActionButtons = () => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.lightpurple,
          borderRadius: 10,
          width: '45%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Image
          resizeMode="contain"
          source={heartimg}
          style={{width: 40, height: 40, marginBottom: 4}}
        />
        <SmallText>Favorites</SmallText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MyStations');
        }}
        style={{
          backgroundColor: Colors.lightpurple,
          paddingHorizontal: 30,
          borderRadius: 10,
          width: '45%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <Image
          source={radioimg}
          resizeMode="contain"
          style={{width: 50, height: 50, marginBottom: 4}}
        />
        <SmallText>My Stations</SmallText>
      </TouchableOpacity>
    </View>
  );
};
const ProfileScreen = () => {
  const {name} = getItem('userdetails', true);

  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30, flex: 1}}>
        <MediumText>My Profile</MediumText>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 30,
          }}>
          <ProfilePic bottom={10} />
          <RegularTextB>{name}</RegularTextB>
        </View>
        <ActionButtons />
      </View>
      <CurrentStation />
    </Mainbackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
