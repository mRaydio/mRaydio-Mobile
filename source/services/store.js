import {create} from 'zustand';

export const useCurrentStation = create(set => ({
  currentStation: {},
  token: '',
  stationName: '',
  setStationName: data => set({stationName: data}),
  setCurrentStation: data => set({currentStation: data}),
  updateToken: token => set({token}),
}));
