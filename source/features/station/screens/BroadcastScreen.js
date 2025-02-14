import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Mainbackground from 'components/Mainbackground';

import {
  AndroidAudioTypePresets,
  AudioSession,
  LiveKitRoom,
  useIOSAudioManagement,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/react-native';

import {LIVEKIT_URL} from '@env';
import {getStationToken} from 'api/stations';
import {useApi} from 'hooks/useApi';
import FastImage from 'react-native-fast-image';
import {SCREEN_WIDTH} from 'constants/Variables';
import {BigText, RegularText, SmallText} from 'components/Text';
import Colors from 'constants/Colors';
import Icon, {Icons} from 'components/Icons';
import Tracks from '../components/Tracks';
import {BackButton} from 'components/IconButton';
import Selector from 'components/Selector';
import {ConnectionState} from '../components/ConnectionState';
import TrackPlayer from 'react-native-track-player';
import SoundBoard from '../components/SoundBoard';
import LiveChat from '../components/LiveChat';
import {eventhandlerOwner} from '../utilis/eventhandler';

const RoomView = ({token}) => {
  const room = useRoomContext();
  useIOSAudioManagement(room);
  useEffect(() => {
    const connect = async () => {
      await room.connect(LIVEKIT_URL, token, {});
      room.on('dataReceived', payload => {
        eventhandlerOwner(payload);
      });
    };
    connect();
    return () => {
      room.disconnect();
      TrackPlayer.reset();
    };
  }, []);
  return <View />;
};

const Broadcast = ({name, picture, stationName}) => {
  const [numViewers, setNumViewers] = useState(1);
  const room = useRoomContext();
  const {localParticipant} = useLocalParticipant({room});
  const [muted, setMuted] = useState(!localParticipant.isMicrophoneEnabled);

  useEffect(() => {
    setNumViewers(room.numParticipants);
    room.on('participantConnected', () => {
      setNumViewers(room.numParticipants);
    });
    room.on('connected', () => {
      setNumViewers(room.numParticipants);
      setMuted(!localParticipant.isMicrophoneEnabled);
    });
    room.on('participantDisconnected', () => {
      setNumViewers(room.numParticipants);
    });
    room.on('reconnected', () => {
      setNumViewers(room.numParticipants);
    });
  }, []);

  const toggleMic = () => {
    setMuted(prev => {
      localParticipant.setMicrophoneEnabled(prev);
      return !prev;
    });
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FastImage
        source={{uri: picture}}
        style={{
          height: SCREEN_WIDTH - 40,
          width: SCREEN_WIDTH - 40,
          alignSelf: 'center',
          borderRadius: 15,
          backgroundColor: Colors.lightpurple,
          marginTop: 10,
        }}
      />
      <View style={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <View style={{flex: 1}}>
            <BigText style={{fontSize: 40}}>{stationName}</BigText>
            <RegularText dim>{name}</RegularText>
          </View>

          <SmallText>
            Listeners: {numViewers - 1 < 0 ? 0 : numViewers - 1}
          </SmallText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 40,
          }}>
          <TouchableOpacity
            onPress={toggleMic}
            style={{
              backgroundColor: Colors.primary,
              width: 60,
              height: 60,
              borderRadius: 360,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              size={20}
              type={Icons.FontAwesome5}
              name={muted ? 'microphone-slash' : 'microphone'}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
        <SoundBoard {...{stationName}} />
      </View>
    </ScrollView>
  );
};

const BroadcastScreen = ({route}) => {
  const {name, stationName, picture} = route.params;
  const {data} = useApi({
    queryKey: [`getStationToken`, stationName],
    queryFn: getStationToken,
  });
  const {token} = data ?? {};
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef();
  useEffect(() => {
    let connect = async () => {
      let outputs = await AudioSession.getAudioOutputs();
      console.log('outputs', outputs);
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

  const Screens = [
    <Broadcast {...{name, picture, stationName}} />,
    <Tracks stationName={stationName} item={route.params} />,
    <LiveChat item={route.params} host={true} />,
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
    <Mainbackground>
      {token ? (
        <LiveKitRoom
          serverUrl={LIVEKIT_URL}
          token={token}
          connect={!!token}
          audio={true}
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
              flatRef={flatRef}
              scrollX={scrollX}
              data={[
                {title: 'Broadcast'},
                {title: 'Tracks'},
                {title: 'Live Chat'},
              ]}
            />
            <View />
          </View>
          <FlatList
            ref={flatRef}
            horizontal
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            snapToInterval={SCREEN_WIDTH}
            bounces={false}
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
            data={[0, 1, 2]}
            renderItem={RenderItem}
          />

          <RoomView token={token} />
          <ConnectionState />
        </LiveKitRoom>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
    </Mainbackground>
  );
};

export default BroadcastScreen;

const styles = StyleSheet.create({});
