import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BackButton} from './IconButton';
import {RegularText} from './Text';

const PageHeader = ({title, bottom}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: bottom,
      }}>
      <BackButton bottom={0} />
      <RegularText>{title}</RegularText>
      <View />
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({});
