import TrackPlayer from 'react-native-track-player';
import {TextEncoder, TextDecoder} from 'text-encoding';

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

export const eventhandler = async payload => {
  const strData = decoder.decode(payload);
  const {event, data} = JSON.parse(strData);

  console.log('data receiv', strData);

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
      await TrackPlayer.seekTo(data.position);

      break;
    }
  }
};
