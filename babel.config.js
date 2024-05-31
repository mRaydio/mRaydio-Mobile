module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./source'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          components: './source/components',
          hooks: './source/hooks',
          features: ['./source/features'],
          svg: ['./source/assets/svg'],
          images: ['./source/assets/images'],
          screens: ['./source/screens'],
          services: ['./source/services'],
          utilis: ['./source/utilis'],
          constants: ['./source/constants'],
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
