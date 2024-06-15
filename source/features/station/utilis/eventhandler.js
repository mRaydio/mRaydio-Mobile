import SoundPlayer from 'react-native-sound-player';
import TrackPlayer from 'react-native-track-player';
import {TextEncoder, TextDecoder} from 'text-encoding';
import RNFS from 'react-native-fs';
import {DeviceEventEmitter, Platform} from 'react-native';

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

export const eventhandler = async payload => {
  const strData = decoder.decode(payload);
  const {event, data} = JSON.parse(strData);

  console.log('data receiv', strData, Platform.OS);

  switch (event) {
    case 'PLAY_TRACK': {
      const trackIndex = await TrackPlayer.getActiveTrackIndex();
      if (trackIndex !== data.index) {
        await TrackPlayer.skip(data.index);
      }
      await TrackPlayer.setVolume(1);
      await TrackPlayer.play();

      break;
    }
    case 'PAUSE_TRACK': {
      await TrackPlayer.pause();

      break;
    }
    case 'STOP_TRACK': {
      await TrackPlayer.stop();

      break;
    }
    case 'SEEK_TRACK': {
      await TrackPlayer.seekTo(data.position);

      break;
    }
    case 'TRACK_VOLUME': {
      await TrackPlayer.setVolume(data.volume);

      break;
    }
    case 'PLAY_SOUND': {
      const FILE_PATH = `${RNFS.DocumentDirectoryPath}/station_sounds/${data.stationName}/${data._id}`;
      console.log('the path', FILE_PATH);
      SoundPlayer.playUrl(FILE_PATH);
      break;
    }

    case 'LIVE_CHAT_MSG': {
      DeviceEventEmitter.emit('livechatMsg', data);

      break;
    }
  }
};

export const eventhandlerOwner = async payload => {
  const strData = decoder.decode(payload);
  const {event, data} = JSON.parse(strData);

  console.log('data receiv', strData, Platform.OS);

  switch (event) {
    case 'LIVE_CHAT_MSG': {
      DeviceEventEmitter.emit('livechatMsg', data);

      break;
    }
  }
};
