import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText, RegularText, SmallText} from 'components/Text';
import Input from 'components/Input';
import Button from 'components/Button';
import {BackButton} from 'components/IconButton';
import {login} from 'api/auth';
import {catchError} from 'utilis/helper_functions';
import {setItem} from 'services/storage';
import ProfilePic from 'components/ProfilePic';

const CreateAccountScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [load, setLoad] = useState(false);
  const [url, setUrl] = useState();

  const validate = () => {
    setLoad(true);
    login({email, password})
      .then(data => {
        console.log('data', data?.data);
        const {user, token} = data?.data;
        if (data.status === 202) {
        } else {
          setItem('token', token);
          setItem('userdetails', user, true);
          navigation.reset({
            index: 0,
            routes: [{name: 'AniStackNav'}],
          });
        }
      })
      .catch(catchError)
      .finally(() => {
        setLoad(false);
      });
  };
  return (
    <Mainbackground style={{paddingHorizontal: 20, paddingTop: 30}}>
      <BackButton />
      <MediumText>Get Started</MediumText>
      <RegularText dim style={{marginTop: 10, marginBottom: 30}}>
        Create a new account
      </RegularText>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 30,
        }}>
        <ProfilePic bottom={7} setUrl={setUrl} purpose="profile-pic" />
        <SmallText dim>Profile Image</SmallText>
      </View>
      <Input
        text={email}
        placeholder="Full Name"
        setText={setEmail}
        bottom={30}
      />
      <Input
        keyboard="email-address"
        text={email}
        placeholder="Email"
        setText={setEmail}
        bottom={30}
      />
      <Input
        password
        text={password}
        placeholder="Password"
        setText={setPassword}
        bottom={30}
      />
      <Button
        title="Sign Up"
        load={load}
        onPress={validate}
        disable={!email || !password}
      />
    </Mainbackground>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({});
