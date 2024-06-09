import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon, {Icons} from './Icons';

export const BackButton = ({bottom = 20}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{marginBottom: bottom}}
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon
        type={Icons.MaterialIcons}
        // size={27}
        name={'arrow-back-ios'}
        color={'white'}
      />
    </TouchableOpacity>
  );
};
