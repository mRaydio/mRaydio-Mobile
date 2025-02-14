import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';

const getContent = async DIR_PATH => {
  RNFS.mkdir(DIR_PATH);
  return await RNFS.readDir(DIR_PATH)
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err.message, err.code);
      return [];
    });
};

export const handleSounds = async ({stationName, sounds}) => {
  const DIR_PATH = `${RNFS.DocumentDirectoryPath}/station_sounds/${stationName}`;
  const result = await getContent(DIR_PATH);
  const downloads = sounds.map(data => {
    const {url, _id} = data ?? {};
    const to = `${DIR_PATH}/${_id}`;
    const i = result.findIndex(data => data.path === to);
    if (i > -1) {
      return null;
    } else {
      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: to,
      });
      return download.promise;
    }
  });

  let filteredArray = downloads.filter(Boolean);
  await Promise.all(filteredArray).then(res => {});
};

export const loadSounds = ({sounds}) => {
  sounds.map(data => {
    const {_id, stationName} = data ?? {};
    const FILE_PATH = `${RNFS.DocumentDirectoryPath}/station_sounds/${stationName}/${_id}`;
    SoundPlayer.loadUrl(FILE_PATH);
  });
};
