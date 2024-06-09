import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SmallText} from './Text';
import Colors from 'constants/Colors';
import {layoutAnimate} from 'utilis/helper_functions';

const ITEM_WIDTH = 100;

const Selector = ({data, index, setIndex}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.lightpurple,
        borderRadius: 360,
        alignItems: 'center',
        height: 40,
      }}>
      <View
        style={{
          backgroundColor: Colors.primary,
          height: 40,
          width: ITEM_WIDTH,
          position: 'absolute',
          borderRadius: 360,
          left: index * ITEM_WIDTH,
        }}
      />
      {data.map((d, i) => (
        <TouchableOpacity
          onPress={() => {
            layoutAnimate();
            setIndex(i);
          }}
          key={i.toString()}
          style={{width: ITEM_WIDTH, alignItems: 'center'}}>
          <SmallText>{d?.title}</SmallText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Selector;

const styles = StyleSheet.create({});
