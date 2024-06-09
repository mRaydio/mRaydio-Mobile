import axios from 'axios';
import {BASEURL} from './base';

export const login = ({email, password}) => {
  const res = axios.post(`${BASEURL}/auth/login`, {
    email,
    password,
  });

  return res;
};
