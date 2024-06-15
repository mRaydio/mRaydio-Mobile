import {StyleSheet, ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import Mainbackground from 'components/Mainbackground';
import {BackButton} from 'components/IconButton';
import {MediumText, RegularText, SmallText} from 'components/Text';
import Input from 'components/Input';
import {useNavigation} from '@react-navigation/native';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import {catchError, showNotification} from 'utilis/helper_functions';
import {createStation} from 'api/stations';

function convertToDecimal(numberStr) {
  if (numberStr.includes('.')) {
    // The number is already a decimal, convert directly to float
    return parseFloat(numberStr);
  } else {
    // The number is an integer, convert to float with .0
    return parseFloat(numberStr).toFixed(1);
  }
}

const CreateStation = ({navigation}) => {
  const [name, setName] = useState();
  const [stationName, setStationName] = useState();
  const [description, setDescription] = useState();
  const [url, setUrl] = useState();
  const [load, setLoad] = useState(false);

  const validate = () => {
    console.log(convertToDecimal(stationName));
    if (url) {
      setLoad(true);
      createStation({
        description,
        name,
        picture: url,
        stationName: convertToDecimal(stationName),
      })
        .then(data => {
          console.log('data', data.data);
          showNotification({msg: 'Station created successfully!'});
          navigation.goBack();
        })
        .catch(catchError);
    } else {
      showNotification({error: true, msg: 'A station image is required!'});
    }
  };
  return (
    <Mainbackground avoid style={{paddingHorizontal: 20, paddingTop: 30}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />
        <MediumText>Create Station</MediumText>
        <RegularText dim style={{marginTop: 10, marginBottom: 30}}>
          Fill details below
        </RegularText>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 30,
          }}>
          <ProfilePic bottom={7} setUrl={setUrl} purpose="station-pics" />
          <SmallText dim>Station Image</SmallText>
        </View>
        <Input
          text={name}
          placeholder="Station Name"
          setText={setName}
          bottom={30}
        />
        <Input
          text={stationName}
          placeholder="Station Number"
          setText={setStationName}
          keyboard="decimal-pad"
          bottom={30}
          maxLength={5}
        />
        <Input
          text={description}
          description
          placeholder="Description"
          setText={setDescription}
          bottom={30}
          maxLength={5}
        />
        <Button
          title="Create Station"
          onPress={validate}
          disable={!name || !stationName}
          load={load}
        />
      </ScrollView>
    </Mainbackground>
  );
};

export default CreateStation;

const styles = StyleSheet.create({});
