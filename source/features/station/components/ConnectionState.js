import {useRoomContext} from '@livekit/react-native';
import {SmallText} from 'components/Text';
import {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const ConnectionState = () => {
  const [status, setStatus] = useState('Connecting');
  const [statusColor, setStatusColor] = useState('#f1c40f');
  const insets = useSafeAreaInsets();
  const room = useRoomContext();

  useEffect(() => {
    room.on('connected', (payload, participant, kind) => {
      console.log('connected', payload);
      setStatus('Connected');
      setStatusColor('green');
    });
    room.on('disconnected', (payload, participant, kind) => {
      console.log('disconnected', payload);
      setStatus('Connecting');
      setStatusColor('#f1c40f');
    });
    room.on('reconnected', (payload, participant, kind) => {
      console.log('reconnected', payload);
      setStatus('Reconnected');
      setStatusColor('green');
    });

    room.on('reconnecting', (payload, participant, kind) => {
      console.log('reconnecting', payload);
      setStatus('Reconnecting');
      setStatusColor('#f1c40f');
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: statusColor,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5 + insets.bottom,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <SmallText style={{top: Platform.OS === 'ios' ? 5 : 0}}>
        {status}
      </SmallText>
    </View>
  );
};
