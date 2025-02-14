import {
  View,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RegularText, SmallText} from 'components/Text';
import Icon, {Icons} from 'components/Icons';
import {pick, types} from 'react-native-document-picker';
import {requestUploadUrl, upload} from 'api/upload';
import {createSound, getSounds} from 'api/stations';
import Colors from 'constants/Colors';
import SoundPlayer from 'react-native-sound-player';
import {
  capitalizeFirstLetter,
  getPercentWidth,
  showNotification,
} from 'utilis/helper_functions';
import {useApi} from 'hooks/useApi';
import {handleSounds, loadSounds} from '../utilis/soundsFileHandler';
import RNFS from 'react-native-fs';
import {eventSender} from '../utilis/helper';
import {useRoomContext} from '@livekit/react-native';

const SoundItemNotUploaded = ({item}) => {
  const {
    name,
    type,
    size,
    fileCopyUri,
    stationName,
    error,
    deleteSong,
    uploadComplete,
  } = item;
  const [newName, setName] = useState(name);
  const [load, setLoad] = useState(false);

  const play = () => {
    console.log('fileCopyUri', fileCopyUri);
    SoundPlayer.setVolume(1);
    SoundPlayer.playUrl(fileCopyUri);
  };

  const uploadSound = async () => {
    setLoad(true);
    const {data: sound} = await createSound({
      name: newName,
      size,
      type,
      stationName,
    });
    console.log('sound', sound);

    const {data} = await requestUploadUrl({
      type,
      purpose: 'station_sounds',
      fileName: sound?.sound?._id,
    });
    const {signedUrl} = data ?? {};
    console.log('data', data);
    await upload({uploadUrl: signedUrl, path: fileCopyUri, type});
    console.log('upload complete');
    setLoad(false);
    uploadComplete();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.lightpurple,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 8,
        marginRight: 15,
        marginBottom: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput
          editable={!error}
          placeholder="Sound Name"
          placeholderTextColor={Colors.dim}
          style={{
            borderBottomWidth: 1,
            color: 'white',
            fontFamily: 'Montserrat-Medium',
            fontSize: 13,
            maxWidth: getPercentWidth(40),
            borderColor: Colors.primary,
            paddingVertical: 0,
            height: 40,
            marginRight: 5,
          }}
          defaultValue={name}
          value={newName}
          onChangeText={setName}
        />
        <TouchableOpacity
          disabled={error}
          style={{opacity: error ? 0.5 : 1}}
          onPress={play}>
          <Icon
            type={Icons.Entypo}
            name={'controller-play'}
            size={20}
            color={'white'}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <SmallText
          disabled={error || load}
          onPress={uploadSound}
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginRight: 10,
            opacity: error || load ? 0.5 : 1,
          }}>
          Upload
        </SmallText>
        <SmallText
          onPress={() => deleteSong()}
          style={{
            backgroundColor: Colors.red,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}>
          Delete
        </SmallText>
      </View>
    </View>
  );
};

const SoundItemUploaded = ({item, room}) => {
  const {name, _id, stationName} = item ?? {};
  const FILE_PATH = `${RNFS.DocumentDirectoryPath}/station_sounds/${stationName}/${_id}`;
  const {send} = eventSender(room);

  const playSound = () => {
    send({
      event: 'PLAY_SOUND',
      data: {
        _id,
        stationName,
      },
    });

    SoundPlayer.playUrl(FILE_PATH);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={playSound}
        style={{
          backgroundColor: Colors.lightpurple,
          paddingRight: 10,
          paddingLeft: 15,
          paddingVertical: 10,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
          marginBottom: 15,
        }}>
        <SmallText>{capitalizeFirstLetter(name)}</SmallText>
        <TouchableOpacity style={{marginLeft: 10}}>
          <Icon
            size={18}
            type={Icons.Feather}
            name={'more-vertical'}
            color={'white'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const SoundItem = ({item, room}) => {
  const {notuploaded} = item ?? {};
  return notuploaded ? (
    <SoundItemNotUploaded item={item} />
  ) : (
    <SoundItemUploaded item={item} room={room} />
  );
};

const SoundBoard = ({stationName}) => {
  const [soundList, setSoundList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {data, refetch} = useApi({
    queryFn: getSounds,
    queryKey: ['getSounds', stationName],
  });

  useEffect(() => {
    const init = async () => {
      console.log('sounds', data);
      setSoundList(data?.sounds);
      await handleSounds({stationName, sounds: data.sounds});
      loadSounds({sounds: soundList.sounds});
    };
    init();
  }, [data]);
  const uploadComplete = () => {
    refetch();
    setUploading(false);
  };
  const deleteSong = () => {
    setUploading(false);
    setSoundList(prev => {
      prev.shift();

      console.log('pre', prev);
      return [...prev];
    });
  };

  useEffect(() => {
    const event = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      async ({success, name, type}) => {
        console.log({success, name, type});
        const info = await SoundPlayer.getInfo();
        console.log('getInfo', info);
        if (info.duration > 10) {
          showNotification({
            msg: 'The audio duration cannot exceed 10 seconds. Please provide a shorter audio clip or use Tracks to upload longer files.',
            error: true,
          });

          setSoundList(prev => {
            const arr = [{...prev[0], error: true}, ...prev.slice(1)];
            return arr;
          });
        }
      },
    );

    return () => {
      event.remove();
    };
  }, []);
  const open = async () => {
    try {
      const response = await pick({
        type: [types.audio],
        copyTo: 'cachesDirectory',
      });
      setUploading(true);
      console.log(response);
      const {fileCopyUri, name, type, size} = response[0];
      const error = size > 5300000;
      if (error) {
        showNotification({
          msg: 'The file cannot be larger than 5 MB. Please upload a smaller file or use Tracks to upload larger files.',
          error: true,
        });
      }
      SoundPlayer.loadUrl(fileCopyUri);
      setSoundList(prev => [
        {
          name,
          fileCopyUri,
          notuploaded: true,
          name,
          type,
          size,
          stationName,
          error,
          deleteSong,
          uploadComplete,
        },
        ...prev,
      ]);
    } catch (err) {
      console.log(err);
      catchError(err);
    }
  };
  const room = useRoomContext();
  return (
    <View style={{marginBottom: 30, flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <RegularText>Soundboard</RegularText>
        <TouchableOpacity disabled={uploading} onPress={open}>
          <Icon
            size={20}
            type={Icons.AntDesign}
            name={'plus'}
            color={Colors.dim}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 15}}>
        {soundList?.map((item, i) => (
          <SoundItem key={i.toString()} item={item} room={room} />
        ))}
      </View>
    </View>
  );
};

export default SoundBoard;
