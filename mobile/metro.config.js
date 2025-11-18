const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable support for path aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@navigation': path.resolve(__dirname, 'src/navigation'),
  '@store': path.resolve(__dirname, 'src/store'),
  '@api': path.resolve(__dirname, 'src/api'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@constants': path.resolve(__dirname, 'src/constants'),
  '@app-types': path.resolve(__dirname, 'src/types'),
  '@theme': path.resolve(__dirname, 'src/theme'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@patterns': path.resolve(__dirname, 'src/patterns'),
};

module.exports = config;
