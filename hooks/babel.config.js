module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'module:react-native-dotenv',
    'react-native-reanimated/plugin'
  ], // 👈 add this line for Reanimated
};
