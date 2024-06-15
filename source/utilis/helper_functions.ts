import {
  DeviceEventEmitter,
  LayoutAnimation,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants/Variables';
import countryData from '../constants/output.json';
import citiesData from '../constants/lgas.json';
import RNFS from 'react-native-fs';

export const layoutAnimate = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};
export const catchError = err => {
  console.log('=== ERROR ====\n', err?.response.data);
  const {message, error} = err?.response?.data ?? {};
  showNotification({msg: message || error, error: true});
};
export const getPercentHeight = (percent: number) => {
  return (percent / 100) * SCREEN_HEIGHT;
};
export const getPercentWidth = (percent: number) => {
  return (percent / 100) * SCREEN_WIDTH;
};

export const getState = ({country}: {country: string}) => {
  if (!country) return [];
  const data = countryData.find(
    data => data.name.toLowerCase() === country.toLowerCase(),
  );
  return data?.states.map(d => {
    return d;
  });
};

export const getCity = ({country, state}: {country: string; state: string}) => {
  if (!country || !state) return [];
  const item = citiesData.find(
    data => data.state?.toLowerCase() === state?.toLowerCase(),
  );
  return item?.lgas;
};

export const formatDate = (date: string) => {
  const givenDate = new Date(date);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate.getTime() - givenDate.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInYears = Math.floor(diffInDays / 365);

  let output;
  if (diffInYears > 0) {
    output = `${givenDate.getUTCFullYear()}/${(givenDate.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0')}/${givenDate.getUTCDate().toString().padStart(2, '0')}`;
  } else if (diffInWeeks > 0) {
    output = `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    output = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    output = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    output = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds > 0) {
    output = `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
  } else {
    output = 'Just now';
  }

  return output;
};

export function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function formatNumberWithCommas(number: number) {
  // Split the number into whole and decimal parts
  const parts = number.toString().split('.');

  // Format the whole number part with commas
  const wholeNumberWithCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // If there is a decimal part, append it back to the whole number with commas
  const result =
    parts.length > 1
      ? wholeNumberWithCommas + '.' + parts[1]
      : wholeNumberWithCommas;

  return result;
}

export const validateEmail = (email: string) => {
  if (!email) return false;
  return email.match(/\S+@\S+\.\S+/);
};

export function capitalizeAllFirstLetters(string: string) {
  if (!string) {
    return '';
  }
  return string
    .split(' ')
    .map(text => capitalizeFirstLetter(text))
    .join(' ');
}

export function capitalizeFirstLetter(string: string) {
  if (!string) return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const pad = (text: string) => {
  if (text.toString().length > 1) {
    return text;
  } else {
    return '0' + text;
  }
};

export const showNotification = ({
  msg,
  error,
}: {
  msg: string;
  error?: boolean;
}) => {
  DeviceEventEmitter.emit('openNotification', {
    error,
    msg,
  });
};

export const requestExternalStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // RNFS.mkdir(
        //   RNFS.ExternalStorageDirectoryPath + '/Xarp Spaces/Received Files',
        // );
      }
    } catch (error) {
      console.error('Error requesting external storage permission:', error);
    }
  } else {
    try {
      // RNFS.mkdir(RNFS.DocumentDirectoryPath + '/Received Files', {
      //   NSURLIsExcludedFromBackupKey: false,
      // });
    } catch (error) {
      console.error('Error creating dir IOS:', error);
    }
  }
};
