import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Mainbackground from 'components/Mainbackground';
import {getSounds, getStationToken, getStations, getTracks} from 'api/stations';
import {useApi} from 'hooks/useApi';
import {
  AndroidAudioTypePresets,
  AudioSession,
  useIOSAudioManagement,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/react-native';
import {LIVEKIT_URL} from '@env';
import {BigText, RegularText, SmallText} from 'components/Text';
import FastImage from 'react-native-fast-image';
import Icon, {Icons} from 'components/Icons';
import Colors from 'constants/Colors';
import {SCREEN_WIDTH} from 'constants/Variables';
import {BackButton} from 'components/IconButton';
import Selector from 'components/Selector';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {eventhandler} from '../utilis/eventhandler';
import {ConnectionState} from '../components/ConnectionState';
import {useCurrentStation} from 'services/store';
import {playTrackFromMeta} from '../utilis/helper';
import {SharedElement} from 'react-navigation-shared-element';
import {handleSounds, loadSounds} from '../utilis/soundsFileHandler';
import LiveChat from '../components/LiveChat';

const RoomView = ({token}) => {
  const room = useRoomContext();

  const {localParticipant} = useLocalParticipant({room});
  useIOSAudioManagement(room);
  localParticipant.setMicrophoneEnabled(false);
  useEffect(() => {
    const connect = async () => {
      await room.connect(LIVEKIT_URL, token);

      await playTrackFromMeta(room.metadata);
    };
    connect();
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
  token,
}) => {
  const [connected, setConnected] = useState(true);
  const room = useRoomContext();

  const next = () => {
    let nextIndex = index + 1;
    if (nextIndex >= stationsList?.stations.length) {
      nextIndex = 0;
    }
    room.disconnect();
    setStationName(stationsList?.stations[nextIndex].stationName);
    setIndex(nextIndex);
    setCurrentStation(stationsList?.stations[nextIndex]);
  };

  const prev = () => {
    let nextIndex = index - 1;

    if (nextIndex < 0) {
      nextIndex = stationsList?.stations.length - 1;
    }
    room.disconnect();
    setStationName(stationsList?.stations[nextIndex].stationName);
    setIndex(nextIndex);
    setCurrentStation(stationsList?.stations[nextIndex]);
  };

  const connect = async () => {
    await room.connect(LIVEKIT_URL, token, {});
    await playTrackFromMeta(room.metadata);
  };

  const toggleConnect = async () => {
    setConnected(prev => {
      if (prev) {
        room.disconnect();
        TrackPlayer.reset();
      } else {
        connect();
      }

      return !prev;
    });
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

      <TouchableOpacity
        onPress={toggleConnect}
        style={{
          backgroundColor: Colors.primary,
          width: 70,
          height: 70,
          borderRadius: 360,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SharedElement id={`station_stop`}>
          <Icon
            type={Icons.Entypo}
            name={connected ? 'controller-stop' : 'controller-play'}
            color={'white'}
            size={24}
          />
        </SharedElement>
      </TouchableOpacity>

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

const Station = ({
  picture,
  stationName,
  name,
  setCurrentStation,
  setStationName,
  setIndex,
  index,
  stationsList,
  token,
}) => {
  const {position, duration} = useProgress();
  if (position && duration && position >= duration) {
    TrackPlayer.stop();
  }

  return (
    <>
      <SharedElement id={`station_image_${stationName}`}>
        <FastImage
          source={{uri: picture}}
          sharedTransitionTag="tag"
          style={{
            height: SCREEN_WIDTH - 40,
            width: SCREEN_WIDTH - 40,
            alignSelf: 'center',
            borderRadius: 15,
            backgroundColor: Colors.lightpurple,
          }}
        />
      </SharedElement>
      <View style={{padding: 20}}>
        <SharedElement id={`station_stationName_${stationName}`}>
          <BigText style={{fontSize: 40}}>{stationName}</BigText>
        </SharedElement>
        <SharedElement id={`station_name_${stationName}`}>
          <RegularText dim>{name}</RegularText>
        </SharedElement>
      </View>
      <View style={{flex: 0.5}} />
      <StationControls
        {...{
          setCurrentStation,
          setIndex,
          setStationName,
          index,
          stationsList,
          token,
        }}
      />
      <View style={{flex: 1}} />
    </>
  );
};
const ViewStation = () => {
  const currentStation = useCurrentStation(state => state.currentStation);
  const setCurrentStation = useCurrentStation(state => state.setCurrentStation);
  const updateToken = useCurrentStation(state => state.updateToken);
  const stationName = useCurrentStation(state => state.stationName);
  const setStationName = useCurrentStation(state => state.setStationName);
  const room = useRoomContext();

  const {picture, name} = currentStation ?? {};
  console.log('currentStation', currentStation);
  const [index, setIndex] = useState(0);
  const {data} = useApi({
    queryKey: [`getStationToken`, stationName],
    queryFn: getStationToken,
  });

  const {data: soundList} = useApi({
    queryFn: getSounds,
    queryKey: ['getSounds', stationName],
  });

  useEffect(() => {
    const init = async () => {
      await handleSounds({stationName, sounds: soundList.sounds});
      loadSounds({sounds: soundList.sounds});
    };

    init();
  }, [soundList]);

  const {data: stationsList} = useApi({
    queryFn: getStations,
    queryKey: ['getStations'],
  });

  const {data: stationTracks} = useApi({
    queryFn: getTracks,
    queryKey: ['getTracks', stationName],
  });

  useEffect(() => {
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
        return data?.stationName === stationName;
      });
      setIndex(currInd);
      setCurrentStation(stationsList.stations[currInd]);
    }
  }, [stationsList]);

  const {token} = data ?? {};

  useEffect(() => {
    const init = async () => {
      if (token) {
        await room.disconnect();
        console.log('updating token', token);
        updateToken(token);
      }
    };
    init();
  }, [data]);

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
  }, []);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef();

  const Screens = [
    <Station
      {...{
        name,
        picture,
        stationName,
        setCurrentStation,
        setStationName,
        index,
        setIndex,
        stationsList,
        token,
      }}
    />,
    <LiveChat item={{name, stationName, picture}} />,
  ];

  const RenderItem = ({item}) => {
    console.log(item);
    return (
      <View
        style={{
          height: '100%',
          width: SCREEN_WIDTH,
        }}>
        {Screens[item]}
      </View>
    );
  };

  return (
    <Mainbackground avoid style={{flex: 1, backgroundColor: Colors.bg}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <BackButton bottom={0} />
        <Selector
          flatRef={flatRef}
          scrollX={scrollX}
          data={[{title: 'Station'}, {title: 'Live Chat'}]}
        />
        <View />
      </View>
      <FlatList
        keyboardShouldPersistTaps="handled"
        ref={flatRef}
        horizontal
        snapToInterval={SCREEN_WIDTH}
        bounces={false}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        data={[0, 1]}
        renderItem={RenderItem}
      />

      <ConnectionState />
      <RoomView token={token} />
    </Mainbackground>
  );
};

export default ViewStation;

const styles = StyleSheet.create({});
