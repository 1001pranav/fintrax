# Fintrax Mobile Architecture

## Overview

The Fintrax mobile application implements a **Layered Architecture** with multiple design patterns to ensure maintainability, testability, and scalability.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  Presentation Layer                         │
│  Components, Screens, Navigation                            │
│  (React Components, React Navigation)                       │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│              State Management Layer                         │
│  Redux Toolkit with Slices                                  │
│  (Auth, Tasks, Projects, Finance)                           │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│               Business Logic Layer                          │
│  API Client, Auth Manager, Offline Manager                  │
│  (Custom Hooks, Service Classes)                            │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│            Data Persistence Layer                           │
│  AsyncStorage, SQLite, SecureStore                          │
│  (Repository Pattern)                                       │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns Implemented

### 1. **Layered Architecture**
- **Purpose**: Separation of concerns
- **Implementation**: Clear separation between Presentation, State Management, Business Logic, and Data Persistence layers
- **Benefits**: Easier testing, maintainability, and code reusability

### 2. **Repository Pattern**
- **Location**: `src/services/storage/`
- **Purpose**: Abstract data access logic
- **Implementation**:
  - `IStorageService` - Interface defining storage contract
  - `AsyncStorageService` - Implementation for app settings
  - `SQLiteService` - Implementation for offline data
  - `SecureStorageService` - Implementation for sensitive data
- **Benefits**: Flexible storage backend, easier testing with mocks

### 3. **Singleton Pattern**
- **Location**: All service classes
- **Purpose**: Single instance of critical services
- **Implementation**:
  ```typescript
  class AuthManager {
    private static instance: AuthManager;
    public static getInstance(): AuthManager { ... }
  }
  ```
- **Benefits**: Controlled access, shared state, resource optimization

### 4. **Factory Pattern**
- **Location**: `src/api/client.ts`
- **Purpose**: Create configured HTTP client instances
- **Implementation**: `ApiClient.getInstance()` creates pre-configured Axios instance
- **Benefits**: Centralized configuration, consistent API calls

### 5. **Strategy Pattern**
- **Location**: `src/services/OfflineManager.ts`
- **Purpose**: Different sync strategies for different operation types
- **Implementation**:
  ```typescript
  interface ISyncStrategy {
    execute(operation: SyncOperation): Promise<void>;
  }

  class CreateStrategy implements ISyncStrategy { ... }
  class UpdateStrategy implements ISyncStrategy { ... }
  class DeleteStrategy implements ISyncStrategy { ... }
  ```
- **Benefits**: Flexible sync logic, easy to add new operation types

### 6. **Command Pattern**
- **Location**: `src/services/OfflineManager.ts`
- **Purpose**: Queue operations for offline sync
- **Implementation**: `SyncOperation` objects stored in queue
- **Benefits**: Undo/retry capability, async execution

### 7. **Observer Pattern**
- **Location**: Redux middleware (`src/store/middleware/syncMiddleware.ts`)
- **Purpose**: React to state changes and trigger sync
- **Implementation**: Middleware observes Redux actions and triggers sync
- **Benefits**: Automatic synchronization, decoupled components

### 8. **Dependency Injection**
- **Location**: Throughout the application
- **Purpose**: Loose coupling between components
- **Implementation**: Services injected via imports, React hooks
- **Benefits**: Testability, flexibility, modularity

## Directory Structure

```
mobile/
├── src/
│   ├── api/                      # API Layer (Factory Pattern)
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── auth.api.ts           # Authentication endpoints
│   │   ├── tasks.api.ts          # Task endpoints
│   │   ├── finance.api.ts        # Finance endpoints
│   │   └── projects.api.ts       # Project endpoints
│   │
│   ├── services/                 # Business Logic Layer
│   │   ├── storage/              # Repository Pattern
│   │   │   ├── IStorageService.ts        # Interface
│   │   │   ├── AsyncStorageService.ts    # Implementation
│   │   │   ├── SQLiteService.ts          # Implementation
│   │   │   └── SecureStorageService.ts   # Implementation
│   │   ├── AuthManager.ts        # Authentication logic (Singleton)
│   │   └── OfflineManager.ts     # Sync logic (Singleton, Strategy, Command)
│   │
│   ├── store/                    # State Management Layer
│   │   ├── slices/               # Redux slices
│   │   │   ├── authSlice.ts      # Auth state
│   │   │   ├── tasksSlice.ts     # Tasks state
│   │   │   ├── projectsSlice.ts  # Projects state
│   │   │   └── financeSlice.ts   # Finance state
│   │   ├── middleware/
│   │   │   └── syncMiddleware.ts # Sync middleware (Observer)
│   │   └── index.ts              # Store configuration
│   │
│   ├── navigation/               # Presentation Layer - Navigation
│   │   ├── AppNavigator.tsx      # Root navigator
│   │   ├── AuthNavigator.tsx     # Auth stack
│   │   └── MainNavigator.tsx     # Main tabs
│   │
│   ├── screens/                  # Presentation Layer - Screens
│   │   ├── auth/                 # Auth screens
│   │   ├── dashboard/            # Dashboard screens
│   │   ├── tasks/                # Task screens
│   │   ├── finance/              # Finance screens
│   │   └── projects/             # Project screens
│   │
│   ├── components/               # Presentation Layer - Components
│   │   ├── common/               # Reusable components
│   │   ├── tasks/                # Task-specific components
│   │   ├── finance/              # Finance-specific components
│   │   └── projects/             # Project-specific components
│   │
│   ├── hooks/                    # Custom Hooks (Dependency Injection)
│   │   ├── useAuth.ts            # Auth operations
│   │   ├── useOfflineSync.ts     # Sync operations
│   │   └── useBiometrics.ts      # Biometric auth
│   │
│   ├── utils/                    # Utility Functions
│   │   ├── dateUtils.ts          # Date formatting
│   │   └── validators.ts         # Input validation
│   │
│   ├── constants/                # Type Definitions & Config
│   │   ├── types.ts              # TypeScript interfaces
│   │   └── config.ts             # App configuration
│   │
│   └── theme/                    # UI Theme
│
├── App.tsx                       # Main app entry point
├── app.json                      # Expo configuration
└── package.json                  # Dependencies

```

## Key Features

### Offline-First Architecture
- **Local Database**: SQLite for storing tasks, projects, transactions
- **Sync Queue**: Operations queued when offline, synced when online
- **Conflict Resolution**: Last-write-wins strategy
- **Network Detection**: Automatic sync trigger when connection restored

### Authentication & Security
- **JWT Tokens**: Stored in SecureStore (encrypted)
- **Biometric Auth**: Face ID, Touch ID, Fingerprint support
- **Auto-refresh**: Token refresh with retry queue
- **Secure Storage**: Encrypted storage for sensitive data

### State Management
- **Redux Toolkit**: Modern Redux with less boilerplate
- **Redux Persist**: Persist auth state across app restarts
- **Middleware**: Custom sync middleware for automatic data sync
- **Typed Hooks**: Type-safe useAppSelector and useAppDispatch

## Data Flow

### Creating a Task (Offline)

```
1. User creates task in UI
   ↓
2. Redux action dispatched (createTask)
   ↓
3. Task saved to SQLite with pending status
   ↓
4. Sync operation queued (Command Pattern)
   ↓
5. Redux state updated (task added to list)
   ↓
6. UI updates immediately
   ↓
7. When online, sync middleware triggers
   ↓
8. Sync strategy executes API call
   ↓
9. Server responds with real ID
   ↓
10. Local task updated with server ID
```

### Authentication Flow

```
1. User enters credentials
   ↓
2. useAuth hook calls login()
   ↓
3. Redux thunk dispatched
   ↓
4. API client sends request
   ↓
5. Server returns JWT + user data
   ↓
6. AuthManager saves tokens to SecureStore
   ↓
7. Redux state updated (user, isAuthenticated)
   ↓
8. Navigation switches to Main navigator
   ↓
9. User can optionally enable biometrics
```

## Testing Strategy

### Unit Tests
- Services: Mock dependencies, test business logic
- Redux slices: Test reducers and async thunks
- Utilities: Test pure functions

### Integration Tests
- API client: Test with mock server
- Storage services: Test with in-memory SQLite
- Offline sync: Test sync queue and strategies

### E2E Tests
- Navigation flows
- Authentication
- Offline mode
- Data synchronization

## Performance Optimizations

1. **Lazy Loading**: Code splitting for screens
2. **Memoization**: React.memo for expensive components
3. **Virtual Lists**: For long lists of tasks/transactions
4. **Image Optimization**: Cached and optimized images
5. **Debouncing**: Search and input debouncing
6. **Background Sync**: Sync happens in background

## Security Considerations

1. **Encrypted Storage**: SecureStore for tokens and credentials
2. **HTTPS Only**: All API calls over HTTPS
3. **No Sensitive Logs**: Production builds don't log sensitive data
4. **Input Validation**: All inputs validated before processing
5. **SQL Injection Prevention**: Parameterized queries only
6. **XSS Prevention**: Sanitized user inputs

## Future Enhancements

1. **Push Notifications**: Firebase Cloud Messaging
2. **Biometric Auto-Login**: Quick app access
3. **Voice Commands**: Siri Shortcuts, Google Assistant
4. **Receipt Scanning**: OCR for expense tracking
5. **Widgets**: Home screen widgets for quick actions
6. **Dark Mode**: Complete dark theme support

## Development Workflow

### Setup
```bash
cd mobile
npm install
cp .env.example .env
```

### Run
```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run on web browser
```

### Build
```bash
npm run build          # Production build
eas build --platform ios     # Build for iOS
eas build --platform android # Build for Android
```

## Contributing

When adding new features:

1. Follow the layered architecture
2. Use appropriate design patterns
3. Write unit tests
4. Document complex logic
5. Update TypeScript types
6. Follow naming conventions

---

**Architecture designed for**: Maintainability, Scalability, Testability, Performance
