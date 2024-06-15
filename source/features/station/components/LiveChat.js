import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StationMiniView from './StationMiniView';
import {FlashList} from '@shopify/flash-list';
import {SmallText} from 'components/Text';
import FastImage from 'react-native-fast-image';
import Colors from 'constants/Colors';
import {useRoomContext} from '@livekit/react-native';
import {eventSender} from '../utilis/helper';
import {getItem} from 'services/storage';
import Icon, {Icons} from 'components/Icons';
import {useCurrentStation} from 'services/store';

const Input = ({host, item}) => {
  const {name, picture} = getItem('userdetails', true);
  const {picture: stationPic, name: stationName} = item ?? {};

  const room = useRoomContext();
  const {send} = eventSender(room);
  const [text, setText] = useState('');
  const sendMsg = () => {
    const data = {
      message: text,
      name: host ? stationName : name,
      picture: host ? stationPic : picture,
      host,
    };
    DeviceEventEmitter.emit('livechatMsg', data);
    send({event: 'LIVE_CHAT_MSG', data});
    setText('');
  };
  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dim,
        borderRadius: 360,
        paddingHorizontal: 20,
      }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Chat"
        placeholderTextColor={Colors.dim}
        style={{
          height: 45,
          padding: 0,
          color: 'white',
          fontFamily: 'Montserrat-Medium',
          flex: 1,
          marginRight: 15,
        }}
      />
      <SmallText
        onPress={sendMsg}
        disabled={!text}
        style={{
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 14,
          color: text ? Colors.primary : Colors.dim,
        }}>
        Send
      </SmallText>
    </View>
  );
};

const RenderMessages = ({item}) => {
  const {message, name, picture, host} = item ?? {};

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
      <View
        style={{
          backgroundColor: Colors.lightpurple,
          width: 45,
          height: 45,
          borderRadius: 360,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}>
        {picture ? (
          <FastImage
            resizeMode="cover"
            source={{uri: picture}}
            style={{
              width: 45,
              height: 45,
              backgroundColor: Colors.lightpurple,
              borderRadius: 360,
            }}
          />
        ) : (
          <Icon size={20} type={Icons.Feather} name={'user'} color={'white'} />
        )}
      </View>

      <View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
          <SmallText dim style={{}}>
            {name}
          </SmallText>
          {host && (
            <View
              style={{
                backgroundColor: Colors.lightpurple,
                borderRadius: 3,
                marginLeft: 5,
                paddingHorizontal: 5,
                paddingVertical: 3,
              }}>
              <SmallText style={{fontSize: 9}} dim>
                Host
              </SmallText>
            </View>
          )}
        </View>
        <SmallText>{message}</SmallText>
      </View>
    </View>
  );
};

const LiveChat = ({item, host}) => {
  const {name} = item;
  const [messages, setMessages] = useState([]);
  const token = useCurrentStation(state => state.token);

  useEffect(() => {
    DeviceEventEmitter.addListener('livechatMsg', data => {
      console.log('live chat msg', data, Platform.OS);
      setMessages(prev => [data, ...prev]);
    });
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [token]);
  return (
    <View style={{paddingBottom: 20, padding: 20, flex: 1}}>
      <StationMiniView {...{...item}} />

      <FlashList
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => {
          return (
            <View>
              <SmallText style={{textAlign: 'center'}} dim>
                Welcome to {name} live chat. Join the conversation, share your
                thoughts, and react to the broadcast as it happens. Please be
                respectful and kind to others, avoid spamming and keep the
                conversation relevant to the broadcast.
              </SmallText>
            </View>
          );
        }}
        extraData={messages}
        inverted={true}
        estimatedItemSize={66}
        data={messages}
        renderItem={RenderMessages}
        keyExtractor={(_, i) => i}
      />
      <Input {...{host, item}} />
    </View>
  );
};

export default LiveChat;

const styles = StyleSheet.create({});
