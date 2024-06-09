import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Mainbackground from 'components/Mainbackground';
import {getStationToken, getStations, getTracks} from 'api/stations';
import {useApi} from 'hooks/useApi';
import {
  AndroidAudioTypePresets,
  AudioSession,
  LiveKitRoom,
  useIOSAudioManagement,
  useIsMuted,
  useLocalParticipant,
  useRoomContext,
  useTracks,
} from '@livekit/react-native';
import {Track} from 'livekit-client';

import {LIVEKIT_URL} from '@env';
import {BigText, MediumText, RegularText, SmallText} from 'components/Text';
import Button from 'components/Button';
import {pick, types} from 'react-native-document-picker';
import Input from 'components/Input';
import FastImage from 'react-native-fast-image';
import {getPercentWidth} from 'utilis/helper_functions';
import Icon, {Icons} from 'components/Icons';
import Colors from 'constants/Colors';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'constants/Variables';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMMKVString} from 'react-native-mmkv';
import {BackButton} from 'components/IconButton';
import Selector from 'components/Selector';
import TrackPlayer from 'react-native-track-player';
import {eventhandler} from '../utilis/eventhandler';
import {ConnectionState} from '../components/ConnectionState';
import LottieView from 'lottie-react-native';

const RoomView = ({token}) => {
  const room = useRoomContext();

  const {localParticipant} = useLocalParticipant({room});
  useIOSAudioManagement(room);
  localParticipant.setMicrophoneEnabled(false);
  useEffect(() => {
    const connect = async () => {
      await room.connect(LIVEKIT_URL, token, {});
    };
    connect();
    return () => {
      room.disconnect();
    };
  }, [token]);

  useEffect(() => {
    room.on('dataReceived', (payload, participant, kind) => {
      eventhandler(payload);
    });
  }, []);
  return <View />;
};

const StationControls = ({
  setStationName,
  setIndex,
  setCurrentStation,
  stationsList,
  index,
}) => {
  const next = () => {
    let nextIndex = index + 1;
    if (nextIndex >= stationsList?.stations.length) {
      nextIndex = 0;
    }
    setStationName(stationsList?.stations[nextIndex].stationName);
    setIndex(nextIndex);
    setCurrentStation(JSON.stringify(stationsList.stations[nextIndex]));
  };

  const prev = () => {
    let nextIndex = index - 1;

    if (nextIndex < 0) {
      nextIndex = stationsList?.stations.length - 1;
    }
    setStationName(stationsList?.stations[nextIndex].stationName);
    setIndex(nextIndex);
    setCurrentStation(JSON.stringify(stationsList.stations[nextIndex]));
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
      }}>
      <TouchableOpacity
        onPress={prev}
        style={{
          width: 50,
          height: 50,
          borderRadius: 360,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          type={Icons.Entypo}
          name={'chevron-thin-left'}
          color={'white'}
          size={20}
        />
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: Colors.primary,
          width: 70,
          height: 70,
          borderRadius: 360,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          source={require('../assets/lottie/wave.json')}
          autoPlay
          loop
          style={{width: 70, height: 70}}
        />
      </View>

      <TouchableOpacity
        onPress={next}
        style={{
          width: 50,
          height: 50,
          borderRadius: 360,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          type={Icons.Entypo}
          name={'chevron-thin-right'}
          color={'white'}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

const ViewStation = ({route}) => {
  const [sel, setSel] = useState(0);

  const [currentStation, setCurrentStation] = useMMKVString('currentStation');
  const {picture, name} = JSON.parse(currentStation ?? '{}');

  console.log('currentStation', currentStation);
  const [stationName, setStationName] = useState('95.1');
  const [index, setIndex] = useState(0);
  const {data} = useApi({
    queryKey: [`getStationToken`, stationName],
    queryFn: getStationToken,
  });

  const {data: stationsList} = useApi({
    queryFn: getStations,
    queryKey: ['getStations'],
  });

  const {data: stationTracks} = useApi({
    queryFn: getTracks,
    queryKey: ['getTracks', stationName],
  });

  useEffect(() => {
    console.log('stationTracks', stationTracks);

    if (stationTracks) {
      TrackPlayer.setQueue(
        stationTracks?.tracks.map(data => {
          return {url: data.url, type: 'hls'};
        }),
      );
    }
  }, [stationTracks]);

  useEffect(() => {
    if (stationsList) {
      const currInd = stationsList.stations.findIndex(data => {
        return data.stationName === stationName;
      });
      setIndex(currInd);
      setCurrentStation(JSON.stringify(stationsList.stations[currInd]));
    }
  }, [stationsList]);
  const {token} = data ?? {};

  useEffect(() => {
    let connect = async () => {
      await AudioSession.configureAudio({
        android: {
          audioTypeOptions: AndroidAudioTypePresets.media,
        },
      });
      await AudioSession.startAudioSession();
    };
    connect();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <Mainbackground style={{flex: 1, backgroundColor: Colors.bg}}>
      {token ? (
        <LiveKitRoom
          serverUrl={LIVEKIT_URL}
          token={token}
          connect={!!token}
          audio={false}
          video={false}>
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <BackButton bottom={0} />
            <Selector
              index={sel}
              setIndex={setSel}
              data={[{title: 'Station'}, {title: 'Live Chat'}]}
            />
            <View />
          </View>
          <FastImage
            source={{uri: picture}}
            style={{
              height: SCREEN_WIDTH - 40,
              width: SCREEN_WIDTH - 40,
              alignSelf: 'center',
              borderRadius: 15,
              backgroundColor: Colors.lightpurple,
            }}
          />

          <View style={{padding: 20}}>
            <BigText style={{fontSize: 40}}>{stationName}</BigText>
            <RegularText dim>{name}</RegularText>
          </View>
          <View style={{flex: 0.5}} />

          <StationControls
            {...{
              setCurrentStation,
              setIndex,
              setStationName,
              index,
              stationsList,
            }}
          />
          <View style={{flex: 1}} />
          <ConnectionState />
          <RoomView token={token} />
        </LiveKitRoom>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
    </Mainbackground>
  );
};

export default ViewStation;

const styles = StyleSheet.create({});
