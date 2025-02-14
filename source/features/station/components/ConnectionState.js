import {useRoomContext} from '@livekit/react-native';
import LayoutAnimationComponent from 'components/LayoutAnimationComponent';
import {SmallText} from 'components/Text';
import {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

let timer;

export const ConnectionState = () => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('');
  const insets = useSafeAreaInsets();
  const room = useRoomContext();

  useEffect(() => {
    setStatus('Connecting');
    setStatusColor('#f1c40f');

    room.on('connected', (payload, participant, kind) => {
      setStatus('Connected');
      setStatusColor('green');
    });
    room.on('disconnected', (payload, participant, kind) => {
      setStatus('Disconnected');
      setStatusColor('#f1c40f');
    });
    room.on('reconnected', (payload, participant, kind) => {
      setStatus('Connected');
      setStatusColor('green');
    });

    room.on('reconnecting', (payload, participant, kind) => {
      setStatus('Reconnecting');
      setStatusColor('#f1c40f');
    });
  }, []);

  useEffect(() => {
    if (status) {
      setShow(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [status, timer]);

  return show ? (
    <LayoutAnimationComponent
      style={{
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5 + insets.bottom,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: statusColor,
      }}
      entering={SlideInDown}
      exit={SlideOutDown}>
      <View>
        <SmallText style={{top: Platform.OS === 'ios' ? 5 : 0}}>
          {status}
        </SmallText>
      </View>
    </LayoutAnimationComponent>
  ) : null;
};
