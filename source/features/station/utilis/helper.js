import {encoder} from './eventhandler';

export const eventSender = room => {
  const send = ({event, data}) => {
    const strData = JSON.stringify({
      event,
      data,
    });
    const senddata = encoder.encode(strData);
    room.localParticipant.publishData(senddata, {reliable: true});
  };

  return {send};
};
