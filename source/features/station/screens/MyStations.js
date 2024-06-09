import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import {
  MediumText,
  RegularText,
  RegularTextB,
  SmallText,
} from 'components/Text';
import {SCREEN_WIDTH} from 'constants/Variables';
import Button from 'components/Button';
import {useNavigation} from '@react-navigation/native';
import {useApi} from 'hooks/useApi';
import {getMyStations} from 'api/stations';
import Colors from 'constants/Colors';
import useRefetchOnRemount from 'hooks/useRefetchOnRemount';
import {FlashList} from '@shopify/flash-list';
import StationItem from '../components/StationItem';

const img1 = require('../../auth/assets/images/img1.png');

const Empty = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flex: 0.3}} />
      <Image
        source={img1}
        style={{
          width: SCREEN_WIDTH - 40,
          height: SCREEN_WIDTH - 40,
        }}
      />
      <RegularTextB style={{marginBottom: 4}}>No Stations Created</RegularTextB>
      <SmallText>Create a new station to see them here.</SmallText>
      <View style={{flex: 1}} />
      <Button
        title="Create Station"
        bottom={30}
        onPress={() => {
          navigation.navigate('CreateStation');
        }}
      />
    </View>
  );
};

const ListStations = ({data}) => {
  return (
    <View style={{flex: 1, paddingTop: 20}}>
      <FlashList estimatedItemSize={85} data={data} renderItem={StationItem} />
      <Button title="Create station" disable bottom={20} />
    </View>
  );
};
const MyStations = () => {
  const {data, isLoading, refetch} = useApi({
    queryFn: getMyStations,
    queryKey: ['getMyStations'],
  });

  console.log('data', data);
  useRefetchOnRemount(refetch);
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 30, flex: 1}}>
        <MediumText>My Stations</MediumText>
        {isLoading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : data?.stations.length === 0 ? (
          <Empty />
        ) : (
          <ListStations data={data?.stations} />
        )}
      </View>
    </Mainbackground>
  );
};

export default MyStations;

const styles = StyleSheet.create({});
