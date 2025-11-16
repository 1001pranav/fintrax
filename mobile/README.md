# Fintrax Mobile App

React Native mobile application for Fintrax built with Expo.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode (macOS only) or Expo Go app
- Android: Android Studio or Expo Go app

## Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Update the API URL in `.env` to point to your backend server.

3. **Start development server:**
   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Start on Android emulator/device
- `npm run ios` - Start on iOS simulator/device (macOS only)
- `npm run web` - Start in web browser

## Project Structure

```
mobile/
├── App.tsx           # Main application component
├── app.json          # Expo configuration
├── assets/           # Images, fonts, and other static assets
├── index.ts          # Entry point
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Running on Device

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Run `npm start`
3. Scan QR code with your device camera (iOS) or Expo Go app (Android)

## Building for Production

See [Expo documentation](https://docs.expo.dev/build/introduction/) for build instructions.

## API Integration

The app connects to the Fintrax backend API. Configure the API URL in `.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:80/api
```

For physical devices, use your computer's local IP address instead of `localhost`.
