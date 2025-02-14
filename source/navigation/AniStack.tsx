import React from 'react';
import BottomNav from './BottomNav';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ViewStation from 'features/station/screens/ViewStation';

const Stack = createSharedElementStackNavigator();

const AniStackNav = () => {
  const sharedElements = route => {
    const {stationName} = route.params ?? {};
    return [
      {
        id: `station_image_${stationName}`,
        animation: 'fade',
        resize: 'clip',
      },
      {
        id: `station_stationName_${stationName}`,
        animation: 'fade',
        resize: 'clip',
      },
      {
        id: `station_name_${stationName}`,
        animation: 'fade',
        resize: 'clip',
      },
      {
        id: `station_stop`,
        animation: 'fade',
        resize: 'clip',
      },
    ];
  };
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => null,
        cardStyle: {backgroundColor: 'transparent'},
        cardStyleInterpolator: ({current: {progress}}) => ({
          gestureEnabled: false,
          cardStyle: {opacity: progress},
        }),
      }}>
      <Stack.Screen name="BottomNav" component={BottomNav} />
      <Stack.Screen
        name="ViewStation"
        component={ViewStation}
        sharedElements={sharedElements}
      />
    </Stack.Navigator>
  );
};

export default AniStackNav;
