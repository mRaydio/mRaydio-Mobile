import {View, Image, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {MediumText, SmallText, TitleText} from 'components/Text';
import {SCREEN_WIDTH} from 'constants/Variables.ts';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';
import Colors from 'constants/Colors';
import Button from 'components/Button';
import LogoSvg from 'svg/logo/logo.svg';

const img1 = require('../assets/images/img1.png');
const img2 = require('../assets/images/img2.png');
const img3 = require('../assets/images/img3.png');
let title;
let body;
const data = [img1, img2, img3];
let intervalId;

const PaginationDot = ({scrollX}) => {
  return (
    <ExpandingDot
      data={data}
      expandingDotWidth={40}
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
  const [stopScroll, setStopScroll] = useState(false);

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const viewabilityConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 70,
  });
  const flatRef = useRef();

  if (index === 0) {
    title = 'Welcome To mRaydio';
    body =
      'Discover a world of personalized raydio stations\ncreated by users just like you';
  } else if (index === 1) {
    title = 'Create Your Station';
    body =
      'mRaydio gives you the platform to broadcast your passion and share your unique ideas.';
  } else if (index === 2) {
    title = 'Connect and Share';
    body =
      'Follow your favorite stations, share your top picks, and enjoy a social listening experience.';
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

  useEffect(() => {
    if (stopScroll) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(scrollCarousel, 5000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [index, intervalId, setStopScroll]);
  return (
    <View
      style={{
        backgroundColor: Colors.bg,
        flex: 1,
        paddingTop: insets.top + 20,
      }}>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <LogoSvg width={25} height={25} />
        <MediumText style={{marginLeft: 15, fontSize: 22}}>mRaydio</MediumText>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <FlashList
          estimatedItemSize={375}
          initialNumToRender={3}
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
          onScrollEndDrag={() => {
            setStopScroll(true);
            clearInterval(intervalId);
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_WIDTH,
                }}>
                <Image
                  resizeMode={index === 0 ? 'cover' : 'contain'}
                  source={item}
                  style={{
                    width: SCREEN_WIDTH - 10,
                    height: SCREEN_WIDTH - 10,
                  }}
                />
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
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
          <Button
            onPress={() => {
              navigation.navigate('BottomNav');
            }}
            bottom={20}
            title="Create Account"
          />
          <SmallText
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}>
            Login
          </SmallText>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
