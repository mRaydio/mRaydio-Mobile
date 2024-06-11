import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {pick, types} from 'react-native-document-picker';
import {requestUploadUrl, upload} from 'api/upload';
import {
  MediumText,
  RegularText,
  RegularTextB,
  SmallText,
} from 'components/Text';
import Icon, {Icons} from 'components/Icons';
import Colors from 'constants/Colors';
import {createTrack, getTracks, startTrack} from 'api/stations';
import {catchError} from 'utilis/helper_functions';
import {useApi} from 'hooks/useApi';
import StationMiniView from './StationMiniView';
import Slider from '@react-native-community/slider';
import {SCREEN_WIDTH} from 'constants/Variables';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {useRoomContext} from '@livekit/react-native';
import {
  clearRoommeta,
  eventSender,
  roomMetadataUpdater,
} from '../utilis/helper';
import {ws} from 'api/base';

const TrackVolume = ({room, stationName}) => {
  const {send} = eventSender(room);

  return (
    <View>
      <View style={{flexDirection: 'row', marginBottom: 5}}>
        <View style={{flex: 1, marginRight: 20}}>
          <SmallText dim>Local Volume</SmallText>
          <View
            style={{
              height: 30,

              transform: [
                {scaleX: Platform.OS == 'ios' ? 0.5 : 1},
                {scaleY: Platform.OS == 'ios' ? 0.5 : 1},
              ],
            }}>
            <Slider
              value={0.03}
              style={{
                width: Platform.OS === 'ios' ? '200%' : (SCREEN_WIDTH - 60) / 2,
                height: 30,
                alignSelf: 'center',
                left: Platform.OS === 'android' ? -2 : 0,
              }}
              minimumValue={0}
              tapToSeek
              maximumValue={1}
              minimumTrackTintColor={'white'}
              maximumTrackTintColor="#000000"
              thumbTintColor="white"
              onSlidingComplete={value => {
                console.log(value);
                TrackPlayer.setVolume(value);
              }}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <SmallText dim>Stream Volume</SmallText>
          <View
            style={{
              height: 30,

              transform: [
                {scaleX: Platform.OS == 'ios' ? 0.5 : 1},
                {scaleY: Platform.OS == 'ios' ? 0.5 : 1},
              ],
            }}>
            <Slider
              value={1}
              style={{
                width: Platform.OS === 'ios' ? '200%' : (SCREEN_WIDTH - 60) / 2,
                height: 30,
                alignSelf: 'center',
                left: Platform.OS === 'android' ? -5 : 0,
              }}
              minimumValue={0}
              tapToSeek
              maximumValue={1}
              minimumTrackTintColor={'white'}
              maximumTrackTintColor="#000000"
              thumbTintColor="white"
              onSlidingComplete={value => {
                console.log(value);
                roomMetadataUpdater(
                  room,
                  {
                    volume: value,
                  },
                  stationName,
                );

                send({data: {volume: value}, event: 'TRACK_VOLUME'});
              }}
            />
          </View>
        </View>
      </View>
      <SmallText dim>
        Please avoid increasing the local volume unless you are using an
        earpiece. Increasing the volume on speakers can cause interference and
        disrupt your stream
      </SmallText>
    </View>
  );
};

const TrackAction = ({stationName, index, isPlaying, setIsplaying, room}) => {
  const {send} = eventSender(room);
  const play = async () => {
    try {
      roomMetadataUpdater(
        room,
        {
          index,
          progress: (await TrackPlayer.getProgress()).position,
          startTime: Date.now(),
        },
        stationName,
      );

      send({
        event: 'PLAY_TRACK',
        data: {
          index,
        },
      });

      const trackIndex = await TrackPlayer.getActiveTrackIndex();
      if (trackIndex !== index) {
        await TrackPlayer.skip(index);
      }

      await TrackPlayer.setVolume(0.03);
      await TrackPlayer.play();
      setIsplaying(true);

      return;
    } catch (err) {
      console.log(err);
    }
  };

  const pause = () => {
    send({
      event: 'PAUSE_TRACK',
    });
    clearRoommeta(stationName);
    TrackPlayer.pause();
    setIsplaying(false);
  };

  const stop = () => {
    send({
      event: 'STOP_TRACK',
    });
    clearRoommeta(stationName);
    TrackPlayer.stop();
    setIsplaying(false);
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={isPlaying ? pause : play}
        style={{marginRight: 10}}>
        {isPlaying ? (
          <Icon
            size={22}
            type={Icons.Ionicons}
            name={'pause-outline'}
            color={'white'}
          />
        ) : (
          <Icon
            size={22}
            type={Icons.Entypo}
            name={'controller-play'}
            color={'white'}
          />
        )}
      </TouchableOpacity>
      {isPlaying ? (
        <TouchableOpacity onPress={stop} style={{marginRight: 0}}>
          <Icon
            size={22}
            type={Icons.Entypo}
            name={'controller-stop'}
            color={'white'}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Icon
            size={22}
            type={Icons.Feather}
            name={'more-vertical'}
            color={'white'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const TrackItem = ({item, stationName, index, room}) => {
  const {name, uploading, url} = item ?? {};
  const progress = useProgress();
  const [isPlaying, setIsplaying] = useState(false);
  const {send} = eventSender(room);
  return (
    <View
      style={{
        backgroundColor: Colors.lightpurple,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bg,
        paddingBottom: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <RegularText style={{fontSize: 15, flex: 1, marginRight: 10}}>
          {name}
        </RegularText>
        {uploading ? (
          <ActivityIndicator color={Colors.dim} size={'small'} />
        ) : (
          <TrackAction
            {...{stationName, url, index, setIsplaying, isPlaying, room}}
          />
        )}
      </View>
      {isPlaying && (
        <View>
          <View
            style={{
              height: 30,
              marginBottom: 5,
              transform: [
                {scaleX: Platform.OS == 'ios' ? 0.5 : 1},
                {scaleY: Platform.OS == 'ios' ? 0.5 : 1},
              ],
            }}>
            <Slider
              value={progress.position}
              style={{
                width: Platform.OS === 'ios' ? '200%' : SCREEN_WIDTH - 60,
                height: 30,
                alignSelf: 'center',
              }}
              minimumValue={0}
              tapToSeek
              maximumValue={progress.duration}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor="#000000"
              thumbTintColor="white"
              onSlidingComplete={value => {
                console.log(value);
                roomMetadataUpdater(
                  room,
                  {
                    progress: value,
                    startTime: Date.now(),
                  },
                  stationName,
                );

                send({
                  event: 'SEEK_TRACK',
                  data: {position: value},
                });
                TrackPlayer.seekTo(value);
              }}
            />
          </View>
          <TrackVolume {...{room, stationName}} />
        </View>
      )}
    </View>
  );
};
const Tracks = ({stationName, item}) => {
  useEffect(() => {
    ws.onmessage = e => {
      // a message was received
      console.log(e.data);
    };
  }, []);
  const room = useRoomContext();
  const {data} = useApi({
    queryFn: getTracks,
    queryKey: ['getTracks', stationName],
  });
  useEffect(() => {
    console.log(data);
    if (data) {
      setTracks(data?.tracks);
      TrackPlayer.setQueue(
        data?.tracks.map(data => {
          return {url: data.url, type: 'hls'};
        }),
      );
    }
  }, [data]);

  const [uploading, setUploading] = useState(false);
  const open = async () => {
    try {
      const response = await pick({
        type: [types.audio],
        copyTo: 'cachesDirectory',
      });
      console.log(response);
      const {fileCopyUri, name, type, size} = response[0];
      const {data: track} = await createTrack({name, size, type, stationName});
      console.log('track', track);

      const {data} = await requestUploadUrl({
        type,
        purpose: 'station_track',
        fileName: track?.track?._id,
      });
      const {publicUrl, signedUrl} = data ?? {};
      console.log('data', data);
      await upload({uploadUrl: signedUrl, path: fileCopyUri, type});
      console.log('upload complete');
    } catch (err) {
      console.log(err);
      catchError(err);
    }
  };
  const [tracks, setTracks] = useState([]);
  return (
    <View style={{marginBottom: 30, padding: 20}}>
      <StationMiniView {...{...item}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        }}>
        <MediumText>Tracks</MediumText>
        <TouchableOpacity disabled={uploading} onPress={open}>
          <Icon
            size={20}
            type={Icons.AntDesign}
            name={'plus'}
            color={Colors.dim}
          />
        </TouchableOpacity>
      </View>
      {tracks.map((data, i) => (
        <TrackItem
          key={i.toString()}
          item={data}
          index={i}
          stationName={stationName}
          room={room}
        />
      ))}
    </View>
  );
};

export default Tracks;

const styles = StyleSheet.create({});
