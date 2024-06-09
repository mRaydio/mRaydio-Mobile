import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Colors from 'constants/Colors';
import Icon, {Icons} from './Icons';
import {requestUploadUrl, upload} from 'api/upload';
import {showNotification} from 'utilis/helper_functions';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfilePic = ({bottom, initialUrl, setUrl, purpose}) => {
  const [url, setTemp] = useState(initialUrl);

  const open = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      if (!result.didCancel) {
        console.log(result.assets);
        const {type, uri} = result?.assets[0];
        setTemp(uri);
        const {data} = await requestUploadUrl({type, purpose});
        const {publicUrl, signedUrl} = data;
        setUrl(publicUrl);
        console.log('re', data);
        await upload({uploadUrl: signedUrl, path: uri, type});
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error || 'An error occurred';
      showNotification({error: true, msg: errorMessage});
    }
  };

  return (
    <TouchableOpacity
      onPress={open}
      style={{
        backgroundColor: Colors.dim,
        width: 100,
        height: 100,
        borderRadius: 360,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: bottom,
      }}>
      {url ? (
        <FastImage
          source={{uri: url}}
          style={{width: 100, height: 100, borderRadius: 360}}
        />
      ) : (
        <Icon size={40} type={Icons.Feather} name={'user'} color={'white'} />
      )}
    </TouchableOpacity>
  );
};

export default ProfilePic;

const styles = StyleSheet.create({});
