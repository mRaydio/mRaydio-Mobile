import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import Input from 'components/Input';
import FastImage from 'react-native-fast-image';
import {SCREEN_WIDTH} from 'constants/Variables';
import {BigText, RegularText, SmallText} from 'components/Text';
import Colors from 'constants/Colors';
import PageHeader from 'components/PageHeader';
import Icon, {Icons} from 'components/Icons';
import {pick, types} from 'react-native-document-picker';
import {requestUploadUrl} from 'api/upload';
import Tracks from '../components/Tracks';
import {BackButton} from 'components/IconButton';
import Selector from 'components/Selector';
import {ConnectionState} from '../components/ConnectionState';

const Soundboard = () => {
  return (
    <View style={{marginBottom: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <RegularText>Soundboard</RegularText>
        <TouchableOpacity>
          <Icon
            size={20}
            type={Icons.AntDesign}
            name={'plus'}
            color={Colors.dim}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LiveChat = () => {
  return (
    <View style={{}}>
      <Input />
    </View>
  );
};

const RoomView = ({token}) => {
  const room = useRoomContext();
  useIOSAudioManagement(room);
  useEffect(() => {
    const connect = async () => {
      await room.connect(LIVEKIT_URL, token, {});
      room.console.log('roo', room.metadata);
    };
    connect();
    return () => {
      room.disconnect();
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

          <SmallText>Listeners: {numViewers - 1}</SmallText>
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
        <Soundboard />
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
  const [sel, setSel] = useState(0);

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
  return (
    <Mainbackground>
      {token ? (
        <LiveKitRoom
          serverUrl={LIVEKIT_URL}
          token={token}
          connect={!!token}
          options={{
            adaptiveStream: {pixelDensity: 'screen'},
          }}
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
              index={sel}
              setIndex={setSel}
              data={[
                {title: 'Broadcast'},
                {title: 'Tracks'},
                {title: 'Live Chat'},
              ]}
            />
            <View />
          </View>
          {sel === 0 ? (
            <Broadcast {...{name, picture, stationName}} />
          ) : sel === 1 ? (
            <Tracks stationName={stationName} item={route.params} />
          ) : null}
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
