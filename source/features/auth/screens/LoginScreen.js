import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Mainbackground from 'components/Mainbackground';
import {MediumText, RegularText} from 'components/Text';
import Input from 'components/Input';
import Button from 'components/Button';
import {BackButton} from 'components/IconButton';
import {login} from 'api/auth';
import {catchError} from 'utilis/helper_functions';
import {setItem} from 'services/storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [load, setLoad] = useState(false);

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
      <MediumText>Welcome Back</MediumText>
      <RegularText dim style={{marginTop: 10, marginBottom: 30}}>
        Login to continue
      </RegularText>
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
        title="Signin"
        load={load}
        onPress={validate}
        disable={!email || !password}
      />
    </Mainbackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
