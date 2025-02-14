import {axiosBase} from './base';

export const getStationToken = async ({queryKey}) => {
  const stationName = queryKey[1];
  const axiosinstance = axiosBase();

  console.log(`/station/get-token?stationName=${stationName}`);

  const res = axiosinstance.post('/station/get-token', {
    stationName,
  });

  return (await res)?.data;
};

export const getStations = async () => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.get('/station/get-stations');

  return (await res)?.data;
};

export const getMyStations = async () => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.get('/station/get-mystations');

  return (await res)?.data;
};

export const createStation = async ({
  stationName,
  name,
  description,
  picture,
}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.post('/station/create-station', {
    stationName,
    name,
    description,
    picture,
  });

  return res;
};

export const createTrack = async ({name, size, type, stationName}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.post('/station/create-track', {
    name,
    size,
    type,
    stationName,
  });

  return res;
};

export const getTracks = async ({queryKey}) => {
  const axiosinstance = axiosBase();
  const stationName = queryKey[1];
  const res = axiosinstance.get(
    `/station/get-tracks?stationName=${stationName}`,
  );

  return (await res)?.data;
};

export const startTrack = async ({url, stationName}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.post('/station/start-track', {
    url,
    stationName,
  });

  return res;
};

export const stopTrack = async ({ingressId}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.post('/station/create-track', {
    ingressId,
  });

  return res;
};

export const createSound = async ({name, size, type, stationName}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.post('/station/create-sound', {
    name,
    size,
    type,
    stationName,
  });

  return res;
};

export const getSounds = async ({queryKey}) => {
  const axiosinstance = axiosBase();
  const stationName = queryKey[1];
  const res = axiosinstance.get(
    `/station/get-sounds?stationName=${stationName}`,
  );

  return (await res)?.data;
};

export const deleteTrack = async ({id}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.delete(`/station/delete-track?id=${id}`);

  return res;
};

export const scheduleTrack = async ({_id, time, stationName, index, url}) => {
  const axiosinstance = axiosBase();

  const res = axiosinstance.post('/station/schedule-track', {
    _id,
    time,
    stationName,
    index,
    url,
  });

  return res;
};
