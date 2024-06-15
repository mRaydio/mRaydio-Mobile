import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SmallText} from './Text';
import Colors from 'constants/Colors';
import {layoutAnimate} from 'utilis/helper_functions';
import {SCREEN_WIDTH} from 'constants/Variables';

const ITEM_WIDTH = 100;

const Selector = ({data, flatRef, scrollX}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.lightpurple,
        borderRadius: 360,
        alignItems: 'center',
        height: 40,
      }}>
      <Animated.View
        style={{
          backgroundColor: Colors.primary,
          height: 40,
          width: ITEM_WIDTH,
          position: 'absolute',
          borderRadius: 360,
          transform: [
            {
              translateX: scrollX.interpolate({
                inputRange: [0, SCREEN_WIDTH * data.length],
                outputRange: [0, ITEM_WIDTH * data.length],
              }),
            },
          ],
        }}
      />
      {data.map((d, i) => (
        <TouchableOpacity
          onPress={() => {
            flatRef.current.scrollToIndex({index: i, animated: true});
          }}
          key={i.toString()}
          style={{
            width: ITEM_WIDTH,
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
          }}>
          <SmallText>{d?.title}</SmallText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Selector;

const styles = StyleSheet.create({});
