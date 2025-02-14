import {Component} from 'react';
import {encoder} from './eventhandler';
import {ws} from 'api/base';
import TrackPlayer from 'react-native-track-player';

export const eventSender = room => {
  const send = ({event, data}) => {
    const strData = JSON.stringify({
      event,
      data,
    });
    console.log('senddata', strData);
    const senddata = encoder.encode(strData);

    room.localParticipant.publishData(senddata, {reliable: true});
  };

  return {send};
};

const metaToJSON = metadata => {
  try {
    const curr = JSON.parse(metadata ?? '{}');
    return curr;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const roomMetadataUpdater = (room, data, roomName) => {
  console.log('curr metadata', room?.metadata);

  const curr = metaToJSON(room?.metadata);

  const newdata = {...curr, ...data};
  console.log('new meta', newdata);
  const msg = {
    event: 'UPDATE_METADATA',
    roomName,
    metadata: newdata,
  };
  console.log('message to send', msg);
  ws.send(JSON.stringify(msg));
};

export const clearRoommeta = roomName => {
  const msg = {
    event: 'UPDATE_METADATA',
    roomName,
    metadata: {},
  };
  console.log('message to send', msg);
  ws.send(JSON.stringify(msg));
};

export const playTrackFromMeta = async metadata => {
  console.log('meta function called', metadata);
  const meta = JSON.parse(metadata ?? '{}');
  console.log('ROOM META', meta);
  const {startTime, progress, index, volume} = meta ?? {};
  if (startTime) {
    const differenceInMilliseconds = Date.now() - startTime;

    const differenceInSeconds = differenceInMilliseconds / 1000;
    const seek = progress + differenceInSeconds;
    console.log(`Track to start from: ${seek} seconds`);
    const trackIndex = await TrackPlayer.getActiveTrackIndex();
    if (trackIndex !== index) {
      await TrackPlayer.skip(index);
    }
    if (volume && typeof volume === 'number') {
      await TrackPlayer.setVolume(volume);
    } else {
      await TrackPlayer.setVolume(1);
    }
    await TrackPlayer.seekTo(seek);
    await TrackPlayer.play();
  }
};
