import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
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
import {createTrack, getTracks, scheduleTrack, startTrack} from 'api/stations';
import {
  catchError,
  formatDateString,
  showNotification,
} from 'utilis/helper_functions';
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
import {getItem} from 'services/storage';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {Dialog} from 'components/Dialog';
import Button from 'components/Button';

const Menu = ({menuInfo, tracks, setMenuInfo}) => {
  const {x, y, index} = menuInfo ?? {};

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const onChange = (event, selectedDate) => {
    console.log('ev', selectedDate, mode);
    const currentDate = selectedDate;
    setDate(currentDate);
    if (mode === 'date') {
      setMode(() => 'time');
      showTimepicker();
    }
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: 'date',
      is24Hour: false,
    });
  };

  const showTimepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: 'time',
      is24Hour: false,
    });
  };

  const schedule = () => {
    const track = tracks[index];

    console.log(track);
    setLoad(true);
    scheduleTrack({...track, index, time: formatDateString(date)})
      .then(d => {
        console.log(d.data);
        setOpen(false);
        setMenuInfo({open: false});
        showNotification({msg: 'Track would play at scheduled time'});
      })
      .catch(err => {
        const {error} = err?.response?.data ?? {};
        if (error?.includes('already exists')) {
          Alert.alert('This track is already scheduled to play');
        } else {
          Alert.alert(error);
        }
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#35334e',
        right: 10,
        zIndex: 1,
        top: y - 110,
        elevation: 5,
        borderRadius: 10,
      }}>
      <SmallText
        onPress={() => {
          console.log('yess');
          if (Platform.OS === 'android') {
            showDatepicker();
          } else {
            setOpen(true);
          }
        }}
        style={{marginRight: 40, marginTop: 20, marginLeft: 20}}>
        Schedule play
      </SmallText>
      <View
        style={{
          width: '100%',
          height: 1,
          marginVertical: 15,
          backgroundColor: Colors.lightpurple,
        }}
      />
      <SmallText
        style={{
          marginRight: 40,
          marginBottom: 20,
          marginLeft: 20,
          color: Colors.red,
        }}>
        Delete
      </SmallText>
      <Dialog
        open={open}
        closeModal={() => {
          setOpen(false);
        }}>
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
          <RegularText style={{marginBottom: 30}}>
            Select Time To Play Track
          </RegularText>
          <DateTimePicker
            value={date}
            mode={'datetime'}
            is24Hour={false}
            onChange={onChange}
          />
          <View style={{flexDirection: 'row', marginTop: 30}}>
            <Button
              small
              onPress={() => {
                setOpen(false);
              }}
              width={30}
              title="Cancel"
              style={{backgroundColor: Colors.red, marginRight: 20}}
            />
            <Button
              width={30}
              load={load}
              small
              title="Schedule"
              onPress={schedule}
            />
          </View>
        </View>
      </Dialog>
    </View>
  );
};
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
              onResponderGrant={() => true}
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
              onResponderGrant={() => true}
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

const TrackAction = ({
  stationName,
  index,
  isPlaying,
  setIsplaying,
  room,
  setMenuInfo,
}) => {
  const {send} = eventSender(room);

  const {position, duration} = useProgress();
  if (position && duration && position >= duration) {
    TrackPlayer.stop();
    setIsplaying(false);
    clearRoommeta(stationName);
    send({
      event: 'STOP_TRACK',
    });
  }

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

  const openMenu = event => {
    const {pageX, pageY} = event.nativeEvent;
    console.log(event.nativeEvent);
    setMenuInfo({open: true, index, x: pageX, y: pageY});
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
        <>
          <TouchableOpacity onPress={openMenu}>
            <Icon
              size={22}
              type={Icons.Feather}
              name={'more-vertical'}
              color={'white'}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const TrackItem = ({item, stationName, index, room, setMenuInfo}) => {
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
            {...{
              stationName,
              url,
              index,
              setIsplaying,
              isPlaying,
              room,
              setMenuInfo,
            }}
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
              onResponderGrant={() => true}
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
      console.log(e.data);
      refetch();
    };
  }, []);
  const room = useRoomContext();
  const {data, refetch} = useApi({
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
  const [menuInfo, setMenuInfo] = useState({open: false});
  const open = async () => {
    try {
      setUploading(true);
      const response = await pick({
        type: [types.audio],
        copyTo: 'cachesDirectory',
      });
      console.log(response);
      const {fileCopyUri, name, type, size} = response[0];

      if (size > 20971520) {
        showNotification({
          msg: 'The file cannot be larger than 20 MB. Please upload a smaller file.',
          error: true,
        });
        return;
      }
      setTracks(prev => [{name, uploading: true}, ...prev]);
      const {data: track} = await createTrack({name, size, type, stationName});
      console.log('track', track);

      const {data} = await requestUploadUrl({
        type,
        purpose: 'station_track',
        fileName: `${track?.track?._id}_${getItem('userdetails', true)._id}`,
      });
      const {signedUrl} = data ?? {};
      console.log('data', data);
      await upload({uploadUrl: signedUrl, path: fileCopyUri, type});
      console.log('upload complete');
      setUploading(false);
    } catch (err) {
      console.log(err);
      catchError(err);
    }
  };
  const [tracks, setTracks] = useState([]);
  return (
    <Pressable
      style={{flex: 1}}
      onPress={() => {
        setMenuInfo({open: false});
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 30, padding: 20}}
        contentContainerStyle={{paddingBottom: 40}}>
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
            setMenuInfo={setMenuInfo}
          />
        ))}
        {menuInfo.open && (
          <Menu menuInfo={menuInfo} tracks={tracks} setMenuInfo={setMenuInfo} />
        )}
      </ScrollView>
    </Pressable>
  );
};

export default Tracks;

const styles = StyleSheet.create({});
