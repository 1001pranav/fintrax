module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@api': './src/api',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@app-types': './src/types',
            '@theme': './src/theme',
            '@services': './src/services',
            '@patterns': './src/patterns',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
