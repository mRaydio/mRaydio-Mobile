import axios, {AxiosInstance} from 'axios';
import {getItem} from 'services/storage';

export const ws = new WebSocket(
  `ws://ec2-3-94-145-169.compute-1.amazonaws.com:8080?token=${getItem(
    'token',
  )}`,
);

export const BASEURL =
  'https://2fw3wjmek6.execute-api.us-east-1.amazonaws.com/dev';

export const axiosBase = (): AxiosInstance => {
  const token = getItem('token');
  if (!token) {
    setTimeout(axiosBase, 2000);
    return {} as AxiosInstance;
  }
  const axiosinstance = axios.create({
    baseURL: BASEURL,
    headers: {Authorization: `Bearer ${token}`},
  });

  // axiosinstance.interceptors.response.use(
  //   response => response,
  //   async error => {
  //     if (error.response && error.response.status === 401) {
  //       console.log(
  //         'Unauthorized error, refresh the token and retry the request',
  //       );
  //       // Unauthorized error, refresh the token and retry the request
  //       const token = await refreshToken();
  //       axiosinstance.defaults.headers.common[
  //         'Authorization'
  //       ] = `Bearer ${token}`;
  //       return axiosinstance(error.config);
  //     }
  //     return Promise.reject(error);
  //   },
  // );

  return axiosinstance;
};
