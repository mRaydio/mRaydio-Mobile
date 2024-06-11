import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Mainbackground from 'components/Mainbackground';
import Search from './components/Search';
import CurrentStation from 'components/CurrentStation';

const SearchScreen = () => {
  return (
    <Mainbackground>
      <View style={{paddingHorizontal: 20, paddingTop: 25}}>
        <Search />
      </View>
      <CurrentStation />
    </Mainbackground>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
