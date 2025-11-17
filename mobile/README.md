# Fintrax Mobile App

React Native mobile application for Fintrax built with Expo, TypeScript, and Redux Toolkit.

## 📋 Prerequisites

- **Node.js:** 20+ and npm
- **Expo CLI:** `npm install -g expo-cli` (optional, can use npx)
- **iOS Development:**
  - macOS with Xcode 14+ (for iOS simulator)
  - iOS device with Expo Go app
- **Android Development:**
  - Android Studio with Android SDK
  - Android device or emulator (API 26+)
  - Expo Go app for physical devices

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the API URL in `.env`:

- **For iOS Simulator/Android Emulator:** Use `http://localhost:80/api`
- **For Physical Devices:** Use your computer's local IP (e.g., `http://192.168.1.100:80/api`)

To find your local IP:

- **macOS/Linux:** `ifconfig | grep "inet "`
- **Windows:** `ipconfig`

### 3. Start Development Server

```bash
npm start
```

This will open Expo Developer Tools in your browser.

### 4. Run on Device/Simulator

#### iOS (macOS only)

```bash
npm run ios
```

Or press `i` in the Expo Developer Tools terminal.

#### Android

```bash
npm run android
```

Or press `a` in the Expo Developer Tools terminal.

#### Physical Device (iOS/Android)

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal or Expo Developer Tools
3. App will open in Expo Go

## 📁 Project Structure

```
mobile/
├── src/
│   ├── api/                      # API client and endpoints
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── auth.api.ts           # Authentication endpoints
│   │   ├── tasks.api.ts          # Task endpoints
│   │   ├── finance.api.ts        # Finance endpoints
│   │   └── projects.api.ts       # Project endpoints
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Buttons, Cards, Inputs
│   │   ├── tasks/                # TaskCard, TaskList
│   │   ├── finance/              # TransactionCard, ChartView
│   │   └── projects/             # ProjectCard, KanbanBoard
│   ├── screens/                  # Screen components
│   │   ├── auth/                 # Login, Register, ForgotPassword
│   │   ├── dashboard/            # DashboardScreen
│   │   ├── tasks/                # TaskListScreen, TaskDetailScreen
│   │   ├── finance/              # FinanceScreen, AddTransactionScreen
│   │   ├── projects/             # ProjectsScreen, ProjectDetailScreen
│   │   └── more/                 # MoreScreen, SettingsScreen
│   ├── navigation/               # Navigation configuration
│   │   ├── AppNavigator.tsx      # Root navigator
│   │   ├── AuthNavigator.tsx     # Auth flow navigation
│   │   └── MainNavigator.tsx     # Main app navigation (tabs)
│   ├── store/                    # Redux store
│   │   ├── index.ts              # Store configuration
│   │   ├── slices/               # Redux slices
│   │   │   ├── authSlice.ts      # User authentication state
│   │   │   ├── tasksSlice.ts     # Tasks state
│   │   │   ├── financeSlice.ts   # Finance state
│   │   │   ├── projectsSlice.ts  # Projects state
│   │   │   └── syncSlice.ts      # Offline sync queue
│   │   └── middleware/           # Custom middleware
│   │       └── syncMiddleware.ts # Offline sync logic
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useOfflineSync.ts     # Offline sync hook
│   │   └── useBiometrics.ts      # Biometric auth hook
│   ├── utils/                    # Utility functions
│   │   ├── dateUtils.ts          # Date formatting
│   │   ├── validators.ts         # Input validation
│   │   ├── storage.ts            # AsyncStorage wrapper
│   │   └── colors.ts             # Theme colors
│   ├── constants/                # App constants
│   │   ├── api.ts                # API URLs
│   │   ├── routes.ts             # Navigation routes
│   │   └── statuses.ts           # Task/finance statuses
│   ├── types/                    # TypeScript types
│   │   ├── api.types.ts          # API response types
│   │   ├── models.types.ts       # Data models
│   │   ├── navigation.types.ts   # Navigation types
│   │   └── env.d.ts              # Environment variable types
│   ├── theme/                    # Theme configuration
│   │   ├── colors.ts             # Color palette
│   │   ├── typography.ts         # Font styles
│   │   └── spacing.ts            # Spacing scale
│   ├── database/                 # SQLite database
│   │   ├── db.ts                 # Database initialization
│   │   ├── schemas.ts            # Table schemas
│   │   └── helpers/              # Database helper functions
│   └── App.tsx                   # App entry point
├── assets/                       # Static assets
│   ├── images/                   # Images
│   ├── fonts/                    # Custom fonts
│   └── icons/                    # App icons
├── __tests__/                    # Test files
│   ├── components/               # Component tests
│   ├── screens/                  # Screen tests
│   └── utils/                    # Utility tests
├── .env.example                  # Environment variables template
├── .env.development              # Development environment
├── .env.production               # Production environment
├── app.json                      # Expo configuration
├── babel.config.js               # Babel configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
└── README.md                     # This file
```

## 📜 Available Scripts

### Development

- `npm start` - Start Expo development server
- `npm run android` - Start on Android emulator/device
- `npm run ios` - Start on iOS simulator/device (macOS only)
- `npm run web` - Start in web browser (for testing UI only)

### Code Quality

- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run type-check` - Run TypeScript type checking

### Testing

- `npm test` - Run Jest tests
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- --coverage` - Generate test coverage report

## 🛠 Tech Stack

### Core

- **React Native:** 0.73+
- **Expo:** 50+
- **TypeScript:** 5.x
- **Node.js:** 20+

### State Management

- **Redux Toolkit:** 2.x (global state management)
- **React Redux:** Integration with React
- **Redux Persist:** State persistence to AsyncStorage

### Navigation

- **React Navigation:** 6.x
  - Stack Navigator
  - Bottom Tab Navigator
  - Drawer Navigator

### UI Components

- **React Native Paper:** Material Design components
- **React Native Vector Icons:** Icon library
- **React Native Gesture Handler:** Touch gestures
- **React Native Reanimated:** 60fps animations

### Data & Storage

- **AsyncStorage:** Key-value storage for settings
- **expo-sqlite:** Local SQLite database for offline data
- **expo-secure-store:** Encrypted storage for JWT tokens

### Networking

- **Axios:** HTTP client with interceptors
- **NetInfo:** Network connectivity detection

### Device Features

- **expo-local-authentication:** Biometrics (Face ID, Touch ID, Fingerprint)
- **expo-notifications:** Push notifications
- **expo-camera:** Receipt scanning
- **expo-haptics:** Haptic feedback

### Development Tools

- **ESLint + Prettier:** Code quality and formatting
- **Jest:** Unit testing
- **TypeScript:** Type safety

## 🔧 Configuration

### TypeScript Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of: import Button from '../../../components/common/Button';
import Button from '@components/common/Button';

// Available aliases:
// @/* - src/*
// @components/* - src/components/*
// @screens/* - src/screens/*
// @navigation/* - src/navigation/*
// @store/* - src/store/*
// @api/* - src/api/*
// @utils/* - src/utils/*
// @hooks/* - src/hooks/*
// @constants/* - src/constants/*
// @types/* - src/types/*
// @theme/* - src/theme/*
```

### Environment Variables

Access environment variables using the `@env` module:

```typescript
import { EXPO_PUBLIC_API_URL } from '@env';

console.log(EXPO_PUBLIC_API_URL); // http://localhost:80/api
```

## 📱 Platform-Specific Notes

### iOS

- Requires macOS for iOS simulator
- Xcode 14+ required
- Supports iOS 15.0+
- Face ID/Touch ID available

### Android

- Supports Android 8.0+ (API 26+)
- Fingerprint/Face Unlock available
- Requires 2GB+ RAM

## 🔐 Security

- **JWT tokens** stored in expo-secure-store (encrypted)
- **Biometric authentication** using device secure enclave
- **HTTPS only** for API communication
- **Local database** can be encrypted with SQLCipher (future)

## 🚧 Troubleshooting

### Common Issues

**1. "Cannot connect to backend API"**

- Check that backend server is running on `http://localhost:80`
- For physical devices, use your computer's local IP instead of localhost
- Ensure firewall allows connections on port 80

**2. "Metro bundler error" or "Unable to resolve module"**

```bash
# Clear cache and restart
npm start -- --clear
```

**3. "Expo Go: Something went wrong"**

- Make sure you're on the same WiFi network as your development machine
- Try restarting Expo Go app
- Clear Expo Go cache

**4. iOS Simulator not opening**

```bash
# Ensure Xcode is installed and command line tools are configured
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**5. Android emulator not starting**

- Open Android Studio > AVD Manager
- Ensure at least one emulator is created
- Start emulator manually before running `npm run android`

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting: `npm run lint && npm test`
4. Commit with clear message
5. Push and create a pull request

## 📄 License

This project is part of the Fintrax application suite.

---

**Happy Coding! 🚀**
