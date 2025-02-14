import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {
  MediumText,
  RegularText,
  RegularTextB,
  SmallText,
} from 'components/Text';
import CurrentStation from 'components/CurrentStation';
import {getStations} from 'api/stations';
import {useApi} from 'hooks/useApi';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import {StationNavigator} from 'components/StationCard';
import {SharedElement} from 'react-navigation-shared-element';

export const Station = ({item}) => {
  const {name, stationName, picture} = item;
  return (
    <StationNavigator item={item}>
      <View
        style={{flexDirection: 'row', marginBottom: 20, alignItems: 'center'}}>
        <SharedElement id={`station_image_${stationName}`}>
          <FastImage
            source={{uri: picture}}
            style={{height: 70, width: 70, marginRight: 10, borderRadius: 3}}
          />
        </SharedElement>
        <View>
          <SharedElement id={`station_name_${stationName}`}>
            <RegularTextB style={{marginBottom: 5, fontSize: 15}}>
              {name}
            </RegularTextB>
          </SharedElement>
          <SharedElement id={`station_stationName_${stationName}`}>
            <SmallText dim>{stationName}</SmallText>
          </SharedElement>
        </View>
      </View>
    </StationNavigator>
  );
};
const DiscoverScreen = () => {
  const {data: stationsList} = useApi({
    queryFn: getStations,
    queryKey: ['getStations'],
  });
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30, flex: 1}}>
        <MediumText style={{marginBottom: 20}}>Discover</MediumText>
        <FlashList
          data={stationsList?.stations}
          estimatedItemSize={85}
          renderItem={Station}
        />
      </View>
      <CurrentStation />
    </Mainbackground>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({});
