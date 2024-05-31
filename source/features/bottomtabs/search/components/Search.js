import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import Icon, {Icons} from 'components/Icons';
import Colors from 'constants/Colors';

const Search = () => {
  return (
    <View
      style={{
        backgroundColor: '#201f2f',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 8,
      }}>
      <Icon
        size={20}
        type={Icons.Feather}
        name={'search'}
        color={Colors.primary}
      />
      <TextInput
        placeholder="Search station"
        placeholderTextColor={Colors.dim}
        style={{
          fontFamily: 'Montserrat-Medium',
          paddingVertical: 0,
          paddingHorizontal: 0,
          height: 50,
          flex: 1,
          marginLeft: 10,
          color: 'white',
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
