import {View, Image, Animated, StatusBar, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SmallText, TitleText} from 'components/Text';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'constants/Variables.ts';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';
import Colors from 'constants/Colors';
import Button from 'components/Button';

const img1 = require('../assets/images/img1.png');
const img2 = require('../assets/images/img2.png');
const img3 = require('../assets/images/img3.png');

const data = [img1, img2, img3];

const PaginationDot = ({scrollX}) => {
  return (
    <ExpandingDot
      data={data}
      expandingDotWidth={50}
      scrollX={scrollX}
      inActiveDotOpacity={1}
      activeDotColor={Colors.primary}
      inActiveDotColor={'white'}
      containerStyle={{
        position: 'relative',
      }}
      dotStyle={{
        width: 7,
        height: 7,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        marginHorizontal: 6,
      }}
    />
  );
};
const OnboardingScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const viewabilityConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 70,
  });
  const flatRef = useRef();
  let title;
  let body;
  if (index === 0) {
    title = 'Welcome To mRaydio';
    body =
      'Discover a world of personalized raydio stations\ncreated by users just like you';
  } else if (index === 1) {
    title = 'Create Your Own Station';
    body =
      'Whether it’s for your favorite genre, a special playlist, or a talk show, mRaydio gives you the platform to broadcast your passion.';
  } else if (index === 2) {
    title = 'Connect and Share';
    body =
      'Connect with a vibrant community of listeners and broadcasters. Follow your favorite stations, share your top picks, and enjoy a social listening experience with friends and family.';
  }
  const onViewableItemsChanged = React.useRef(({viewableItems}) => {
    const firstVisibleItem = viewableItems[0];
    const currentIndex = firstVisibleItem?.index;
    setIndex(currentIndex);
  });

  const scrollCarousel = () => {
    let nextIndex = index + 1;

    if (nextIndex >= data.length) {
      nextIndex = 0;
    }

    flatRef.current.scrollToIndex({index: nextIndex, animated: true});
  };

  //   useEffect(() => {
  //     const intervalId = setInterval(scrollCarousel, 6000);
  //     return () => clearInterval(intervalId);
  //   }, [index]);

  return (
    <View style={{backgroundColor: Colors.bg, flex: 1}}>
      {/* <FlashList
        estimatedItemSize={343}
        initialNumToRender={4}
        showsHorizontalScrollIndicator={false}
        ref={flatRef}
        removeClippedSubviews
        renderToHardwareTextureAndroid
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        snapToInterval={SCREEN_WIDTH}
        bounces={false}
        decelerationRate={'fast'}
        horizontal
        data={data}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        renderItem={({item}) => {
          return (
            <Image
              resizeMode="cover"
              source={item}
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT + StatusBar.currentHeight,
              }}
            />
          );
        }}
      /> */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          padding: 20,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <PaginationDot {...{scrollX}} />
        <TitleText
          style={{
            marginBottom: 8,
            color: 'white',
            lineHeight: 38,
            fontSize: 32,
          }}>
          {title}
        </TitleText>
        <SmallText
          style={{
            marginBottom: 50,
            color: '#E0E0E0',
            fontSize: 14,
            textAlign: 'center',
          }}>
          {body}
        </SmallText>

        <View
          style={{
            marginBottom: 15 + insets.bottom / 2,

            marginTop: 15,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Button bottom={20} title="Create Account" />
          <SmallText>Login</SmallText>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
