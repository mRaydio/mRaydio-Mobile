import {create} from 'zustand';

export const useCurrentStation = create(set => ({
  currentStation: {},
  token: '',
  setCurrentStation: data => set({currentStation: data}),
  updateToken: token => set({token}),
}));
