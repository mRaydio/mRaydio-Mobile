import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {
  MediumText,
  RegularText,
  RegularTextB,
  SmallText,
} from 'components/Text';
import Button from 'components/Button';
import CurrentStation from 'components/CurrentStation';
import {useApi} from 'hooks/useApi';
import {getStations} from 'api/stations';
import {FlashList} from '@shopify/flash-list';
import StationCard from 'components/StationCard';
import LogoSvg from 'svg/logo/logo.svg';
import {Station} from '../discover/DiscoverScreen';

const HomeScreen = ({navigation}) => {
  const {data: stationsList} = useApi({
    queryFn: getStations,
    queryKey: ['getStations'],
  });
  console.log(stationsList);
  return (
    <Mainbackground insetsBottom={-1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20, paddingTop: 20}}>
        <View
          style={{
            paddingBottom: 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LogoSvg width={25} height={25} style={{marginRight: 10}} />
          <RegularTextB>mRaydio</RegularTextB>
        </View>
        <MediumText style={{marginBottom: 30, fontSize: 20}}>
          Popular Stations
        </MediumText>
        <FlashList
          estimatedItemSize={220}
          horizontal
          data={stationsList?.stations}
          renderItem={StationCard}
          showsHorizontalScrollIndicator={false}
        />
        <MediumText style={{marginBottom: 30, marginTop: 40, fontSize: 20}}>
          Your Favourites
        </MediumText>
        <FlashList
          estimatedItemSize={220}
          horizontal
          data={stationsList?.stations}
          renderItem={StationCard}
          showsHorizontalScrollIndicator={false}
        />
        <MediumText style={{marginBottom: 30, fontSize: 20, marginTop: 40}}>
          Recently Viewed
        </MediumText>
        <FlashList
          estimatedItemSize={85}
          data={stationsList?.stations}
          renderItem={Station}
        />
      </ScrollView>
      <CurrentStation />
    </Mainbackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
