import {MMKV} from 'react-native-mmkv';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';

const storage = new MMKV();

export const setItem = (key: string, value: any, shouldStringify?: boolean) => {
  console.log('SAVING', value);
  const mainvalue = shouldStringify ? JSON.stringify(value) : value;
  storage.set(key, mainvalue);
};

export const getItem = (key: string, shouldParse?: boolean, init = []) => {
  const value = storage.getString(key);
  if (value) {
    return shouldParse ? JSON.parse(value) : value;
  } else {
    return shouldParse ? init : null;
  }
};

export const deleteItem = (key: string) => {
  storage.delete(key);
};

const clientStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
  },
  getItem: key => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: key => {
    storage.delete(key);
  },
};

export const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
});
