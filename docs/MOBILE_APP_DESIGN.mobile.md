# Mobile Application Design Document
## Fintrax Mobile - iOS & Android

**Version:** 1.0
**Date:** November 14, 2025
**Status:** Design Phase
**Target Platforms:** iOS 15+ and Android 8.0+

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mobile App Overview](#2-mobile-app-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [UI/UX Design](#4-uiux-design)
5. [Feature Specifications](#5-feature-specifications)
6. [Data Synchronization](#6-data-synchronization)
7. [Performance Optimization](#7-performance-optimization)
8. [Security Architecture](#8-security-architecture)
9. [Offline Functionality](#9-offline-functionality)
10. [Platform-Specific Features](#10-platform-specific-features)
11. [Development Roadmap](#11-development-roadmap)
12. [Testing Strategy](#12-testing-strategy)

---

## 1. Executive Summary

### 1.1 Purpose
This document outlines the design and architecture for the Fintrax mobile applications (iOS and Android), extending the existing web platform to provide native mobile experiences for productivity and finance management.

### 1.2 Business Goals
- **Increase User Engagement:** Enable on-the-go access to tasks and financial tracking
- **Market Expansion:** Reach mobile-first users (60% of target demographic)
- **User Retention:** Improve daily active users with push notifications
- **Competitive Advantage:** Native mobile experience vs web-only competitors

### 1.3 Key Differentiators
- **Offline-First:** Full functionality without internet connectivity
- **Native Performance:** Smooth animations, instant interactions
- **Mobile-Optimized UX:** Designed for thumb zones and one-handed use
- **Device Integration:** Camera (receipt scanning), biometrics, widgets
- **Cross-Platform Sync:** Real-time synchronization with web and other devices

### 1.4 Target Platforms

| Platform | Minimum Version | Target Devices |
|----------|----------------|----------------|
| **iOS** | iOS 15.0+ | iPhone 8 and newer, iPad (tablet-optimized) |
| **Android** | Android 8.0 (API 26)+ | Devices with 2GB+ RAM, mdpi to xxxhdpi screens |

---

## 2. Mobile App Overview

### 2.1 Core Features (MVP)

**Productivity Management:**
- ✅ Task creation and editing with voice input
- ✅ Kanban board with swipe gestures
- ✅ Project management with color coding
- ✅ Calendar view with date picker
- ✅ Quick task capture widget
- ✅ Push notifications for task reminders

**Finance Management:**
- ✅ Transaction logging with camera receipt capture
- ✅ Expense categorization with quick filters
- ✅ Savings and loan tracking
- ✅ Dashboard with financial charts
- ✅ Biometric authentication
- ✅ Export transaction history

**User Experience:**
- ✅ Dark mode support
- ✅ Offline mode with sync queue
- ✅ Biometric login (Face ID, Touch ID, Fingerprint)
- ✅ Home screen widgets (iOS/Android)
- ✅ Siri Shortcuts / Google Assistant actions
- ✅ Haptic feedback for interactions

### 2.2 User Personas

**Primary Persona: Mobile-First Professional**
- **Age:** 25-35
- **Usage:** Quick task capture during commute, expense tracking on-the-go
- **Pain Points:** Needs fast access, limited typing time, wants voice input
- **Goals:** Maintain productivity without sitting at desk

**Secondary Persona: Freelancer/Entrepreneur**
- **Age:** 28-40
- **Usage:** Project management from anywhere, invoice tracking
- **Pain Points:** Irregular income/expenses, multiple projects
- **Goals:** Financial overview at a glance, mobile invoicing (future)

---

## 3. Technical Architecture

### 3.1 Technology Stack Selection

#### Option 1: React Native (Cross-Platform) - 

**Advantages:**
- ✅ Code sharing with web app (React components)
- ✅ Single codebase for iOS and Android (70-80% code reuse)
- ✅ Existing team expertise (React 19, TypeScript)
- ✅ Large ecosystem (libraries, community)
- ✅ Hot reload for faster development
- ✅ Native modules for platform-specific features

**Disadvantages:**
- ⚠️ Slightly lower performance vs native (negligible for this app)
- ⚠️ Larger bundle size (mitigated with Hermes engine)

**Recommendation:** React Native with TypeScript and Expo for rapid development

#### Option 2: Flutter (Alternative Cross-Platform)

**Advantages:**
- ✅ High performance (compiled to native)
- ✅ Beautiful UI with Material Design and Cupertino widgets
- ✅ Strong typing with Dart

**Disadvantages:**
- ❌ Team learning curve (new language)
- ❌ No code sharing with existing React web app

#### Option 3: Native Development (iOS: Swift, Android: Kotlin)

**Advantages:**
- ✅ Best performance and platform integration
- ✅ Access to latest platform features immediately

**Disadvantages:**
- ❌ Two separate codebases (doubled development effort)
- ❌ Slower time to market
- ❌ Higher maintenance costs

**DECISION: React Native** for optimal development speed and code reuse

---

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Mobile App (React Native)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Presentation Layer                      │  │
│  │  ┌─────────────┬──────────────┬─────────────────┐    │  │
│  │  │   Screens   │  Components  │  Navigation     │    │  │
│  │  │  (Login,    │  (TaskCard,  │  (Stack,Tab)    │    │  │
│  │  │  Dashboard, │  ChartView)  │                 │    │  │
│  │  │  Tasks)     │              │                 │    │  │
│  │  └─────────────┴──────────────┴─────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              State Management Layer                   │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Redux Toolkit / Zustand                        │  │  │
│  │  │  - User Slice      - Finance Slice              │  │  │
│  │  │  - Task Slice      - Sync Slice                 │  │  │
│  │  │  - Project Slice   - Offline Queue              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Business Logic Layer                    │  │
│  │  ┌──────────────┬──────────────┬──────────────────┐  │  │
│  │  │  API Client  │ Auth Manager │  Offline Manager │  │  │
│  │  │  (axios)     │ (JWT, Bio)   │  (Sync Queue)    │  │  │
│  │  └──────────────┴──────────────┴──────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Data Persistence Layer                  │  │
│  │  ┌──────────────┬──────────────┬──────────────────┐  │  │
│  │  │  AsyncStorage│  SQLite DB   │  Secure Storage  │  │  │
│  │  │  (settings)  │  (local data)│  (JWT, bio)      │  │  │
│  │  └──────────────┴──────────────┴──────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Existing Go/Gin Server)           │
│  - User Authentication      - Task Management               │
│  - Finance Operations       - Project Management            │
│  - Data Synchronization     - Push Notification Service     │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Technology Stack Details

**Framework & Core:**
- **React Native:** 0.73+ (latest stable)
- **TypeScript:** 5.x (type safety)
- **Expo:** 50+ (managed workflow for faster development)
- **Node.js:** 20+ (for build tools)

**State Management:**
- **Redux Toolkit:** 2.x (global state with slices)
  - Alternative: Zustand (if web app state manager is Zustand)
- **RTK Query:** API caching and synchronization
- **Redux Persist:** State persistence to AsyncStorage

**UI Libraries:**
- **React Native Paper:** Material Design components
- **React Native Elements:** Cross-platform UI toolkit
- **React Native Vector Icons:** Icon library
- **React Native Chart Kit:** Financial charts
- **React Native Gesture Handler:** Touch gestures
- **React Native Reanimated:** 60fps animations

**Navigation:**
- **React Navigation:** 6.x
  - Stack Navigator (screen transitions)
  - Bottom Tab Navigator (main navigation)
  - Drawer Navigator (side menu)

**Data & Storage:**
- **AsyncStorage:** Key-value storage for settings
- **SQLite (expo-sqlite):** Local database for offline data
- **Realm:** Alternative for complex offline queries (future)
- **expo-secure-store:** Encrypted storage for tokens

**Networking:**
- **Axios:** HTTP client with interceptors
- **axios-retry:** Retry failed requests
- **NetInfo:** Network connectivity detection

**Authentication & Security:**
- **expo-local-authentication:** Biometrics (Face ID, Touch ID)
- **expo-secure-store:** Encrypted credential storage
- **JWT:** Token-based authentication (from web API)

**Device Features:**
- **expo-camera:** Receipt scanning (OCR future)
- **expo-image-picker:** Attach images to transactions
- **expo-notifications:** Push notifications
- **expo-location:** Location-based reminders (future)
- **expo-haptics:** Haptic feedback
- **expo-calendar:** Task integration with device calendar

**Development Tools:**
- **ESLint + Prettier:** Code quality
- **Jest:** Unit testing
- **Detox:** E2E testing for React Native
- **Reactotron:** Debugging and state inspection
- **Sentry:** Error tracking

---

### 3.4 Folder Structure

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
│   │   └── projects/             # ProjectsScreen, ProjectDetailScreen
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
│   │   └── navigation.types.ts   # Navigation types
│   ├── theme/                    # Theme configuration
│   │   ├── colors.ts             # Color palette
│   │   ├── typography.ts         # Font styles
│   │   └── spacing.ts            # Spacing scale
│   └── App.tsx                   # App entry point
├── assets/                       # Static assets
│   ├── images/                   # Images
│   ├── fonts/                    # Custom fonts
│   └── icons/                    # App icons
├── __tests__/                    # Test files
│   ├── components/               # Component tests
│   ├── screens/                  # Screen tests
│   └── utils/                    # Utility tests
├── ios/                          # iOS native code
├── android/                      # Android native code
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # Project documentation
```

---

## 4. UI/UX Design

### 4.1 Design Principles

**Mobile-First Design:**
1. **Thumb-Friendly:** Primary actions within thumb reach (bottom 60% of screen)
2. **Gestural:** Swipe to delete, pull to refresh, drag to reorder
3. **Progressive Disclosure:** Show essential info first, details on tap
4. **One-Handed Use:** Critical features accessible with single hand
5. **Instant Feedback:** Loading states, haptics, visual confirmations

**Platform Conventions:**
- **iOS:** Follow Human Interface Guidelines (HIG)
  - Native navigation patterns (push/pop animations)
  - SF Symbols for icons
  - Bottom tab bar navigation
- **Android:** Follow Material Design 3
  - Floating Action Button (FAB) for primary actions
  - Navigation drawer option
  - Material You theming support

### 4.2 Screen Flow Diagram

```
App Launch
    │
    ├─ Not Authenticated
    │   └─ Onboarding Screens (first time)
    │       └─ Login / Register
    │           └─ Email Verification (OTP)
    │               └─ Biometric Setup (optional)
    │
    └─ Authenticated
        └─ Main App (Bottom Tab Navigator)
            ├─ Dashboard Tab
            │   ├─ Welcome Hero
            │   ├─ Quick Stats
            │   └─ Recent Activity
            ├─ Tasks Tab
            │   ├─ Task List (filters)
            │   ├─ Add Task (FAB/+)
            │   └─ Task Detail (tap task)
            ├─ Finance Tab
            │   ├─ Balance Overview
            │   ├─ Transaction List
            │   ├─ Add Transaction (FAB/+)
            │   └─ Charts View
            ├─ Projects Tab
            │   ├─ Project Grid
            │   ├─ Add Project
            │   └─ Project Detail
            │       └─ Kanban Board
            └─ More Tab
                ├─ Roadmaps
                ├─ Settings
                ├─ Profile
                └─ Logout
```

### 4.3 Screen Specifications

#### 4.3.1 Splash Screen
**Duration:** 1-2 seconds
**Content:**
- Fintrax logo (centered)
- App name
- Tagline: "Productivity & Finance, Unified"
- Loading indicator (bottom)

**Technical:**
- iOS: LaunchScreen.storyboard
- Android: splash_screen.xml (Android 12+ Splash API)

---

#### 4.3.2 Onboarding (First Launch Only)

**Screen 1: Welcome**
- Illustration: Task checkmarks + dollar sign
- Headline: "Manage Tasks & Finances in One App"
- CTA: "Get Started"

**Screen 2: Features**
- Swipeable cards showing:
  - Task management
  - Finance tracking
  - Project roadmaps
- Skip button (top right)

**Screen 3: Permissions**
- Notifications: "Stay on top of deadlines"
- Biometrics: "Secure, fast login"
- Allow/Deny buttons

---

#### 4.3.3 Authentication Screens

**Login Screen:**
```
┌─────────────────────────────────────────┐
│  [< Back]                               │
│                                         │
│          [Fintrax Logo]                 │
│                                         │
│  Welcome Back                           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Email                             │  │
│  │ john@example.com                  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Password                          │  │
│  │ ••••••••••                    [👁] │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [ ] Remember me     Forgot Password?   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         LOGIN                     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────── OR ───────────              │
│                                         │
│  [🔐 Login with Face ID]                │
│                                         │
│  Don't have an account? Sign Up         │
└─────────────────────────────────────────┘
```

**Features:**
- Email/password validation
- Password visibility toggle
- Biometric login shortcut (if enabled)
- Remember me option
- Error messages inline

---

**Register Screen:**
```
┌─────────────────────────────────────────┐
│  [< Back]                               │
│                                         │
│  Create Account                         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Full Name                         │  │
│  │ John Doe                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Email                             │  │
│  │ john@example.com                  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Password                          │  │
│  │ ••••••••••                    [👁] │  │
│  └───────────────────────────────────┘  │
│  [████████░░] Strong                    │
│                                         │
│  [✓] I agree to Terms & Privacy Policy  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │       CREATE ACCOUNT              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Already have an account? Login         │
└─────────────────────────────────────────┘
```

**Features:**
- Real-time password strength indicator
- Email format validation
- Terms of service checkbox
- Navigate to Login

---

**Email Verification (OTP):**
```
┌─────────────────────────────────────────┐
│  [< Back]                               │
│                                         │
│  Verify Your Email                      │
│                                         │
│  We sent a 4-digit code to              │
│  john@example.com                       │
│                                         │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐               │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │               │
│  └───┘ └───┘ └───┘ └───┘               │
│                                         │
│  Didn't receive code?                   │
│  Resend in 00:45                        │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         VERIFY                    │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Auto-focus OTP input boxes
- Auto-advance on digit entry
- Countdown timer for resend
- Paste from SMS support (iOS/Android)

---

#### 4.3.4 Dashboard Screen (Main)

```
┌─────────────────────────────────────────┐
│  Good Morning, John! ☀️         [🔔]    │
│  Thursday, Nov 14                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 💰 Total Balance    📊 Net Worth   ││
│  │   $25,450.00          $32,100      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Quick Actions                       ││
│  │ [+ Task] [+ Transaction] [+ Project]││
│  └─────────────────────────────────────┘│
│                                         │
│  Today's Tasks (3)          [View All] │
│  ┌─────────────────────────────────────┐│
│  │ [!] Complete SRD Document     [✓]  ││
│  │     Due in 2 hours                 ││
│  ├─────────────────────────────────────┤│
│  │ [!] Client meeting prep       [✓]  ││
│  │     Due today                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  Recent Transactions        [View All] │
│  ┌─────────────────────────────────────┐│
│  │ 🍔 Lunch - Starbucks      -$12.50  ││
│  │    Today, 1:30 PM                  ││
│  ├─────────────────────────────────────┤│
│  │ 💵 Salary Deposit       +$5,000   ││
│  │    Yesterday                       ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Dashboard] [Tasks] [Finance] [More]  │
└─────────────────────────────────────────┘
```

**Widgets:**
1. **Greeting Header:** Time-based greeting + notification badge
2. **Financial Summary:** Balance, net worth (tap for details)
3. **Quick Actions:** FABs for common tasks
4. **Today's Tasks:** High-priority tasks due today
5. **Recent Transactions:** Last 5 transactions
6. **Bottom Tab Navigation:** 4-5 tabs

**Gestures:**
- Pull-to-refresh (entire screen)
- Swipe left on task → Mark complete
- Swipe right on task → Edit
- Long-press on quick action → Alternative options

---

#### 4.3.5 Tasks Screen

```
┌─────────────────────────────────────────┐
│  Tasks                          [+ New] │
│                                         │
│  [All ▾] [Priority ▾] [Project ▾] [🔍] │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🔴 HIGH PRIORITY                    ││
│  ├─────────────────────────────────────┤│
│  │ [!] Complete project proposal  [✓] ││
│  │     Project: Website Redesign      ││
│  │     Due: Nov 15, 2025              ││
│  ├─────────────────────────────────────┤│
│  │ [!] Review pull requests       [✓] ││
│  │     Due: Nov 14, 2025 (Today)      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🟡 MEDIUM PRIORITY                  ││
│  ├─────────────────────────────────────┤│
│  │ Update documentation           [✓] ││
│  │     Due: Nov 20, 2025              ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Kanban] [Calendar] [List]            │
│                                         │
│  [Dashboard] [Tasks] [Finance] [More]  │
└─────────────────────────────────────────┘
```

**Features:**
- Multi-level filters (status, priority, project)
- Search bar
- Priority color coding
- Swipe actions (complete, delete, edit)
- View switcher (List, Kanban, Calendar)
- FAB for adding tasks

**Swipe Gestures:**
- Swipe right → Mark complete (green)
- Swipe left → Delete (red, with confirmation)
- Long press → Edit menu

---

**Task Detail Screen:**
```
┌─────────────────────────────────────────┐
│  [< Back]  Task Detail        [⋮ Menu] │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Title                             │  │
│  │ Complete project proposal         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Description                       │  │
│  │ Write comprehensive proposal for  │  │
│  │ client website redesign project.  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Priority:    [!] High                  │
│  Status:      In Progress               │
│  Due Date:    Nov 15, 2025              │
│  Project:     Website Redesign          │
│                                         │
│  Subtasks (2/5 completed)               │
│  ┌─────────────────────────────────────┐│
│  │ [✓] Research competitors           ││
│  │ [✓] Create wireframes              ││
│  │ [ ] Draft content                  ││
│  │ [ ] Design mockups                 ││
│  │ [ ] Finalize proposal              ││
│  └─────────────────────────────────────┘│
│                                         │
│  Resources (3)                          │
│  📎 design-brief.pdf                    │
│  🔗 Client website reference            │
│  📝 Meeting notes                       │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        SAVE CHANGES               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Features:**
- Inline editing (all fields)
- Date picker for due date
- Project selector dropdown
- Subtask management (add, complete, delete)
- Attach resources (links, files, notes)
- Voice-to-text for description

---

#### 4.3.6 Finance Screen

```
┌─────────────────────────────────────────┐
│  Finance                        [+ Add] │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 💰 Balance         $25,450.00      ││
│  │                    +$2,340 this mo. ││
│  │                                     ││
│  │ [Income] [Expenses] [Savings] [📊] ││
│  └─────────────────────────────────────┘│
│                                         │
│  This Month                             │
│  ┌─────────────────────────────────────┐│
│  │ Income:         $5,000.00  ↗️      ││
│  │ Expenses:       -$2,660.00 ↘️      ││
│  │ Net:            +$2,340.00  ✓      ││
│  └─────────────────────────────────────┘│
│                                         │
│  Recent Transactions    [Filter ▾]     │
│  ┌─────────────────────────────────────┐│
│  │ 🍔 Lunch - Starbucks      -$12.50  ││
│  │    Food & Dining • Today, 1:30 PM  ││
│  ├─────────────────────────────────────┤│
│  │ 💵 Salary Deposit       +$5,000.00 ││
│  │    Income • Yesterday               ││
│  ├─────────────────────────────────────┤│
│  │ 🏠 Rent Payment        -$1,200.00  ││
│  │    Housing • Nov 1, 2025           ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Dashboard] [Tasks] [Finance] [More]  │
└─────────────────────────────────────────┘
```

**Features:**
- Balance card with monthly trend
- Income/Expense tabs
- Quick stats (monthly summary)
- Transaction list with category icons
- Filter by date range, type, category
- Pull-to-refresh

**Add Transaction (Bottom Sheet):**
```
┌─────────────────────────────────────────┐
│  New Transaction              [✕ Close] │
│                                         │
│  Type: ( Income ) (● Expense)           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Amount                            │  │
│  │ $ 45.00                           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Category                          │  │
│  │ Food & Dining              [▾]    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Source/Description                │  │
│  │ Dinner at Italian restaurant      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Date: Nov 14, 2025          [📅]      │
│                                         │
│  [📷 Scan Receipt]                      │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        SAVE TRANSACTION           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Features:**
- Toggle income/expense
- Large number pad for amount input
- Category picker with icons
- Date picker (defaults to today)
- Camera integration for receipt scanning (OCR future)
- Quick save with haptic feedback

---

#### 4.3.7 Projects Screen

```
┌─────────────────────────────────────────┐
│  Projects                       [+ New] │
│                                         │
│  Active Projects (4)                    │
│  ┌─────────────────────────────────────┐│
│  │ 🟦 Website Redesign                 ││
│  │    8/12 tasks • 67% complete        ││
│  │    ████████░░░░ Due: Nov 30         ││
│  ├─────────────────────────────────────┤│
│  │ 🟩 Mobile App Development           ││
│  │    15/20 tasks • 75% complete       ││
│  │    ███████████░ Due: Dec 15         ││
│  ├─────────────────────────────────────┤│
│  │ 🟧 Marketing Campaign               ││
│  │    3/10 tasks • 30% complete        ││
│  │    ███░░░░░░░░░ Due: Nov 20         ││
│  └─────────────────────────────────────┘│
│                                         │
│  Completed (2)             [View All]  │
│  ┌─────────────────────────────────────┐│
│  │ ✓ Q3 Financial Audit                ││
│  │   Completed: Oct 28, 2025           ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Dashboard] [Tasks] [Finance] [More]  │
└─────────────────────────────────────────┘
```

**Features:**
- Project cards with color coding
- Progress bars with percentage
- Task counts (completed/total)
- Due date indicators
- Completed projects section (collapsible)
- Tap project → Open project detail

---

**Project Detail (Kanban View):**
```
┌─────────────────────────────────────────┐
│  [< Back] Website Redesign    [⋮ Menu] │
│                                         │
│  [Kanban] [Calendar] [Settings]        │
│                                         │
│  ◄ Swipe Columns ►                      │
│  ┌──────────┬───────────┬──────────┐   │
│  │ TO DO    │ IN PROG.  │   DONE   │   │
│  ├──────────┼───────────┼──────────┤   │
│  │ [!] Wire-│ Research  │ Client   │   │
│  │  frames  │ competi-  │ kickoff  │   │
│  │          │ tors      │ meeting  │   │
│  │          │           │          │   │
│  │ Content  │ Design    │ Gather   │   │
│  │ draft    │ mockups   │ assets   │   │
│  │          │           │          │   │
│  │ [+ Add]  │ [+ Add]   │ [+ Add]  │   │
│  └──────────┴───────────┴──────────┘   │
│                                         │
│  [+] Add Task                           │
│                                         │
│  [Dashboard] [Tasks] [Finance] [More]  │
└─────────────────────────────────────────┘
```

**Features:**
- Horizontal swipe between columns
- Drag-and-drop tasks between columns
- Priority indicators on tasks
- Add task to specific column
- View switcher (Kanban, Calendar, Settings)

---

#### 4.3.8 More/Settings Screen

```
┌─────────────────────────────────────────┐
│  More                                   │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 👤 John Doe                         ││
│  │    john@example.com                 ││
│  │    [Edit Profile]                   ││
│  └─────────────────────────────────────┘│
│                                         │
│  PRODUCTIVITY                           │
│  ┌─────────────────────────────────────┐│
│  │ 🗺️  Roadmaps                    [>] ││
│  │ 🏷️  Tags                         [>] ││
│  │ 📊 Analytics                    [>] ││
│  └─────────────────────────────────────┘│
│                                         │
│  FINANCE                                │
│  ┌─────────────────────────────────────┐│
│  │ 💰 Savings                      [>] ││
│  │ 🏦 Loans                        [>] ││
│  │ 📈 Reports                      [>] ││
│  └─────────────────────────────────────┘│
│                                         │
│  SETTINGS                               │
│  ┌─────────────────────────────────────┐│
│  │ 🔐 Security                     [>] ││
│  │ 🔔 Notifications                [>] ││
│  │ 🎨 Appearance                   [>] ││
│  │ 💾 Backup & Sync                [>] ││
│  │ ℹ️  About                       [>] ││
│  │ 🚪 Logout                       [>] ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Dashboard] [Tasks] [Finance] [More]  │
└─────────────────────────────────────────┘
```

**Settings Screens:**

**Security Settings:**
- Enable biometric login (toggle)
- Change password
- Two-factor authentication (future)

**Notifications:**
- Push notifications (toggle)
- Task reminders (toggle)
- Payment reminders (toggle)
- Email notifications (toggle)

**Appearance:**
- Theme: Light / Dark / Auto
- Primary color accent picker

**Backup & Sync:**
- Last synced: Nov 14, 2025 at 3:45 PM
- Auto-sync toggle
- Manual sync button
- Export data (JSON/CSV)

---

### 4.4 Gestures and Interactions

| Gesture | Action | Context |
|---------|--------|---------|
| **Pull-to-refresh** | Sync data from server | All list screens |
| **Swipe right (task)** | Mark as complete | Task lists |
| **Swipe left (task)** | Delete with confirmation | Task lists |
| **Swipe left (transaction)** | Delete with confirmation | Finance transactions |
| **Long press (task)** | Quick actions menu (edit, duplicate, delete) | Tasks |
| **Drag & drop** | Reorder tasks, move between Kanban columns | Kanban board |
| **Pinch to zoom** | Zoom charts | Finance charts |
| **Double tap** | Quick complete task | Task cards |
| **Shake device** | Undo last action | Global |

---

### 4.5 Dark Mode Support

**Color Palette:**

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Background** | #FFFFFF | #121212 |
| **Surface** | #F5F5F5 | #1E1E1E |
| **Primary** | #3B82F6 | #60A5FA |
| **Text** | #1F2937 | #F9FAFB |
| **Text Secondary** | #6B7280 | #9CA3AF |
| **Success** | #10B981 | #34D399 |
| **Warning** | #F59E0B | #FBBF24 |
| **Danger** | #EF4444 | #F87171 |

**Implementation:**
- Respect system theme preference
- Option to override in settings
- Smooth transition animation
- Save preference to AsyncStorage

---

### 4.6 Accessibility

**WCAG 2.1 AA Compliance:**
- ✅ Text contrast ratio 4.5:1 minimum
- ✅ Touch targets 44x44pt minimum
- ✅ Screen reader support (iOS VoiceOver, Android TalkBack)
- ✅ Dynamic type support (iOS)
- ✅ Reduce motion option
- ✅ Focus indicators for keyboard navigation

**Implementation:**
- Use `accessibilityLabel` props
- Semantic HTML (headings, lists)
- Alternative text for images/icons
- Keyboard navigation support

---

## 5. Feature Specifications

### 5.1 Quick Task Capture

**User Story:**
> As a busy professional, I want to quickly capture tasks without navigating through multiple screens, so that I don't lose ideas.

**Implementation:**
- **Widget (iOS):** Home screen widget with "+Add Task" button
- **Widget (Android):** Home screen widget with input field
- **Siri Shortcut (iOS):** "Hey Siri, add task to Fintrax"
- **Google Assistant (Android):** "OK Google, add task in Fintrax"
- **Quick Add FAB:** Floating Action Button on Dashboard

**Flow:**
1. User taps widget/FAB or uses voice command
2. Bottom sheet appears with minimal form:
   - Title (required)
   - Priority (default: Medium)
   - Project (optional, quick picker)
3. User saves → Task created locally
4. Background sync uploads to server when online

---

### 5.2 Receipt Scanning (Future Enhancement)

**User Story:**
> As a user tracking expenses, I want to scan receipts with my camera, so I don't have to manually type transaction details.

**Implementation (Phase 2):**
- **Camera Integration:** expo-camera
- **OCR:** Google ML Kit (Firebase ML) or AWS Textract
- **Data Extraction:**
  - Merchant name
  - Total amount
  - Date
  - Category (auto-suggested based on merchant)

**Flow:**
1. User taps "Scan Receipt" in Add Transaction screen
2. Camera opens with receipt frame overlay
3. User captures photo
4. OCR processes image (loading state)
5. Pre-filled transaction form appears
6. User reviews and edits if needed
7. Save transaction

---

### 5.3 Push Notifications

**Notification Types:**

| Type | Trigger | Example |
|------|---------|---------|
| **Task Reminder** | Task due in 1 hour | "High priority task due in 1 hour: Complete SRD" |
| **Loan Payment** | Payment due in 3 days | "Loan payment of $500 due on Nov 17" |
| **Budget Alert** | Spending exceeds 80% of budget | "You've spent $1,600 of $2,000 food budget" |
| **Savings Milestone** | Savings goal reached | "Congratulations! You reached your $10,000 goal" |
| **Daily Summary** | 8 PM daily | "You completed 5 tasks today!" |
| **Sync Conflict** | Offline changes conflict | "We found conflicting changes. Please review." |

**Implementation:**
- **Library:** expo-notifications
- **Backend:** Firebase Cloud Messaging (FCM) for both iOS/Android
- **Scheduling:** Local notifications for reminders
- **Remote:** Server-triggered for events

**Settings:**
- User can enable/disable per category
- Quiet hours (e.g., 10 PM - 8 AM)
- Notification sound customization

---

### 5.4 Biometric Authentication

**Supported Methods:**
- **iOS:** Face ID, Touch ID
- **Android:** Fingerprint, Face Unlock

**Implementation:**
- **Library:** expo-local-authentication
- **Storage:** JWT token in expo-secure-store
- **Fallback:** Password login if biometrics fail

**Flow:**
1. User enables biometric login in settings
2. App prompts for biometric authentication on next launch
3. If successful, retrieve JWT from secure storage
4. Auto-login to app
5. If biometrics fail 3 times, fallback to password

**Security:**
- Biometric authentication uses device secure enclave
- JWT token never leaves device
- User can disable biometrics in settings

---

### 5.5 Home Screen Widgets

**iOS Widget (Small):**
```
┌─────────────────┐
│ FINTRAX         │
│                 │
│ Balance         │
│ $25,450.00      │
│                 │
│ 3 tasks due     │
│ today           │
└─────────────────┘
```

**iOS Widget (Medium):**
```
┌─────────────────────────────────┐
│ FINTRAX                         │
│                                 │
│ Balance: $25,450 | Tasks: 15   │
│                                 │
│ Today's Tasks:                  │
│ • Complete SRD (Due 5 PM)       │
│ • Client meeting (Due 2 PM)     │
│                                 │
│ [+ Quick Add]                   │
└─────────────────────────────────┘
```

**Android Widget (4x2):**
```
┌─────────────────────────────────┐
│ FINTRAX          [🔄]           │
│                                 │
│ 💰 $25,450    📋 15 tasks       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [+ Task] [+ Transaction]    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Implementation:**
- **iOS:** WidgetKit (SwiftUI)
- **Android:** App Widget (Jetpack Glance recommended)
- **Data:** Read from SQLite local database
- **Refresh:** Every 15 minutes or on app open

---

### 5.6 Voice Commands

**iOS Siri Shortcuts:**
- "Add task [task name]"
- "What's my balance?"
- "Show today's tasks"
- "Log expense [amount] for [category]"

**Android Google Assistant Actions:**
- "OK Google, add task in Fintrax"
- "OK Google, check my Fintrax balance"
- "OK Google, show my tasks for today"

**Implementation:**
- **iOS:** SiriKit Intents
- **Android:** Google Assistant Actions
- Parse voice input → Create task/transaction → Confirm with notification

---

## 6. Data Synchronization

### 6.1 Sync Strategy

**Offline-First Architecture:**
- All data stored locally in SQLite
- UI reads from local database
- Changes queued for sync when offline
- Automatic sync when online

**Sync Flow:**
```
User Action (Create/Update/Delete)
    │
    ▼
Save to Local SQLite Database
    │
    ▼
Update Redux State (immediate UI update)
    │
    ▼
Check Network Status
    │
    ├─ Online
    │   └─ Send to Backend API (async)
    │       ├─ Success → Mark synced in local DB
    │       └─ Failure → Keep in sync queue, retry
    │
    └─ Offline
        └─ Add to Sync Queue (pending_sync table)
            └─ When online → Process queue
```

### 6.2 Conflict Resolution

**Conflict Scenarios:**
1. **User edits task offline, same task edited on web**
2. **User deletes transaction offline, transaction edited on web**

**Resolution Strategy:**

| Scenario | Resolution |
|----------|------------|
| **Last-Write-Wins** | Default for most entities (timestamp comparison) |
| **Manual Merge** | For critical data (financial transactions) |
| **Server Priority** | For deletions (server delete always wins) |

**Implementation:**
- Each record has `updated_at` timestamp
- Compare local vs server timestamp on sync
- If conflict detected:
  - **Auto-resolve:** Apply last-write-wins
  - **Notify user:** Show notification for review
  - **Conflict UI:** Screen to choose version

**Conflict UI:**
```
┌─────────────────────────────────────────┐
│  Sync Conflict Detected                 │
│                                         │
│  The following item was changed both    │
│  on your device and on another device:  │
│                                         │
│  Task: "Complete project proposal"      │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Your Version (this device)          ││
│  │ Status: Completed                   ││
│  │ Updated: Nov 14, 3:45 PM            ││
│  │                                     ││
│  │ [Use This Version]                  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Server Version (other device)       ││
│  │ Status: In Progress                 ││
│  │ Updated: Nov 14, 3:50 PM (5m later) ││
│  │                                     ││
│  │ [Use This Version]                  ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Review All Conflicts (2)]             │
└─────────────────────────────────────────┘
```

---

### 6.3 Sync Queue Management

**pending_sync Table Schema:**
```sql
CREATE TABLE pending_sync (
  id INTEGER PRIMARY KEY,
  entity_type TEXT NOT NULL,      -- 'task', 'transaction', 'project'
  entity_id INTEGER NOT NULL,     -- Local ID
  action TEXT NOT NULL,            -- 'create', 'update', 'delete'
  payload TEXT,                    -- JSON payload for create/update
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Processing:**
- Background sync every 30 seconds when online
- Exponential backoff for failed requests (1s, 2s, 4s, 8s, max 60s)
- Maximum 5 retry attempts
- After 5 failures, mark as "manual review needed"

**User Notification:**
- Show sync status indicator in app bar
  - ✓ Synced (green)
  - ⟳ Syncing... (blue)
  - ! Sync failed (red, tap to retry)

---

### 6.4 Delta Sync Optimization

**Problem:** Full sync on every app open is slow and wasteful

**Solution:** Delta sync
- Client sends last sync timestamp to server
- Server returns only changes since that timestamp
- Client applies changes to local database

**API Endpoint:**
```
GET /api/sync?last_sync=2025-11-14T15:30:00Z

Response:
{
  "tasks": {
    "created": [...],
    "updated": [...],
    "deleted": [123, 456]
  },
  "transactions": {
    "created": [...],
    "updated": [...],
    "deleted": []
  },
  "sync_timestamp": "2025-11-14T16:00:00Z"
}
```

---

## 7. Performance Optimization

### 7.1 App Size Optimization

**Target:** < 50 MB download size

**Strategies:**
- **Code Splitting:** Load screens on-demand
- **Image Optimization:** WebP format, multiple resolutions
- **Remove Unused Code:** Tree-shaking, ProGuard (Android), Bitcode (iOS)
- **Font Subsetting:** Include only used characters
- **Asset Compression:** Compress images, videos

**Hermes Engine (React Native):**
- Pre-compiled bytecode (faster startup)
- Reduced memory usage
- Smaller app size

---

### 7.2 Launch Time Optimization

**Target:** < 2 seconds cold start

**Strategies:**
1. **Splash Screen:** Show immediately (iOS: LaunchScreen, Android: Splash API)
2. **Lazy Load:** Defer non-critical modules
3. **Preload Critical Data:** Load user session from SecureStore in parallel
4. **Optimize SQLite:** Create indexes on frequently queried columns
5. **Reduce JS Bundle:** Code splitting, remove unused dependencies

**Measurement:**
- iOS: Xcode Instruments (Time Profiler)
- Android: Android Studio Profiler
- React Native: Flipper

---

### 7.3 Rendering Performance

**Target:** 60 FPS (16.67ms per frame)

**Strategies:**
- **FlatList Optimization:**
  - `getItemLayout` for fixed-height items
  - `maxToRenderPerBatch={10}`
  - `windowSize={5}`
  - `removeClippedSubviews={true}`
- **React.memo:** Prevent unnecessary re-renders
- **useCallback/useMemo:** Memoize functions and values
- **React Native Reanimated:** 60fps animations (runs on UI thread)
- **Avoid Inline Styles:** Pre-define StyleSheet styles

**Example:**
```typescript
const TaskCard = React.memo(({ task, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(task.id);
  }, [task.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
```

---

### 7.4 Network Optimization

**Strategies:**
- **Request Batching:** Combine multiple API calls
- **Caching:** RTK Query with cache invalidation
- **Pagination:** Load 20-50 items at a time
- **Retry Logic:** Exponential backoff for failed requests
- **Compression:** gzip/brotli for API responses
- **Image Caching:** React Native Fast Image

**RTK Query Setup:**
```typescript
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Task', 'Transaction'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => '/todo',
      providesTags: ['Task'],
      keepUnusedDataFor: 300, // 5 minutes cache
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: '/todo',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});
```

---

### 7.5 Battery Optimization

**Strategies:**
- **Background Sync:** Limit to WiFi only option
- **Reduce Location Updates:** Use significant change API
- **Throttle Network Requests:** Batch sync every 30s instead of real-time
- **Dark Mode:** OLED power savings (30% battery reduction)
- **Lazy Image Loading:** Load images only when visible

---

## 8. Security Architecture

### 8.1 Secure Token Storage

**JWT Token Storage:**
- **Library:** expo-secure-store
- **iOS:** Keychain (encrypted by system)
- **Android:** EncryptedSharedPreferences (Android Keystore)

**Implementation:**
```typescript
import * as SecureStore from 'expo-secure-store';

// Save token
await SecureStore.setItemAsync('jwt_token', token);

// Retrieve token
const token = await SecureStore.getItemAsync('jwt_token');

// Delete token (logout)
await SecureStore.deleteItemAsync('jwt_token');
```

**Biometric Protection:**
- Require biometrics to access stored token
- `SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY` access level

---

### 8.2 API Communication Security

**HTTPS Only:**
- All API requests use HTTPS
- Certificate pinning (production) to prevent MITM attacks

**Request Interceptors:**
```typescript
axios.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await SecureStore.deleteItemAsync('jwt_token');
      navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);
```

---

### 8.3 Data Encryption

**Local Database Encryption:**
- **SQLite:** SQLCipher for encrypted database
- **Key Management:** Derive encryption key from device keychain

**Sensitive Fields:**
- Passwords: Never stored locally (only hashed on server)
- Financial data: Encrypted at rest in SQLite
- Biometric data: Never leaves device (handled by OS)

---

### 8.4 Code Obfuscation

**iOS:**
- Bitcode enabled (compiler optimizations)
- Strip debug symbols in release build

**Android:**
- ProGuard/R8 for code minification and obfuscation
- Remove logging statements in production

---

### 8.5 Security Best Practices

**Input Validation:**
- Validate all user inputs client-side
- Re-validate on server (never trust client)
- Sanitize inputs to prevent XSS/SQL injection

**Secure Defaults:**
- Require biometrics for financial operations (optional setting)
- Auto-logout after 5 minutes of inactivity (configurable)
- Disable screenshots in sensitive screens (Android)

**Privacy:**
- Request minimum permissions
- Explain why each permission is needed
- Allow users to revoke permissions

---

## 9. Offline Functionality

### 9.1 Offline Capabilities

**Fully Offline:**
- ✅ View all tasks, projects, transactions
- ✅ Create new tasks and transactions
- ✅ Edit existing items
- ✅ Delete items (soft delete locally)
- ✅ View financial charts (local data)
- ✅ Search and filter

**Requires Connection:**
- ❌ User registration/login (first time)
- ❌ Email verification (OTP)
- ❌ Password reset
- ❌ Export data to external services

---

### 9.2 Local Database Schema

**SQLite Tables:**

```sql
-- Users (cached after login)
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  synced_at TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 5,
  status INTEGER DEFAULT 1,
  due_date TEXT,
  project_id INTEGER,
  is_synced BOOLEAN DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Projects
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  status INTEGER DEFAULT 1,
  is_synced BOOLEAN DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  source TEXT NOT NULL,
  amount REAL NOT NULL,
  type INTEGER NOT NULL,
  category TEXT,
  date TEXT NOT NULL,
  is_synced BOOLEAN DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync Queue
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  payload TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_transactions_date ON transactions(date);
```

---

### 9.3 Offline Indicator

**Network Status Detection:**
```typescript
import NetInfo from '@react-native-community/netinfo';

const [isOnline, setIsOnline] = useState(true);

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsOnline(state.isConnected && state.isInternetReachable);
  });

  return () => unsubscribe();
}, []);
```

**UI Indicator:**
```
┌─────────────────────────────────────────┐
│  Tasks                  [📶] Offline    │
│                                         │
│  ⚠️ You're offline. Changes will sync   │
│     when you reconnect.                 │
│                                         │
│  [Pending changes: 3]                   │
```

---

### 9.4 Background Sync

**Implementation:**
- **iOS:** Background App Refresh (15min intervals)
- **Android:** WorkManager (flexible intervals)

**Sync Conditions:**
- Device online
- Battery > 15% (optional setting)
- WiFi only mode (optional setting)

```typescript
// React Native Background Task
import BackgroundFetch from 'react-native-background-fetch';

BackgroundFetch.configure({
  minimumFetchInterval: 15, // minutes
  stopOnTerminate: false,
  startOnBoot: true,
}, async (taskId) => {
  console.log('[BackgroundFetch] Task:', taskId);
  await syncPendingChanges();
  BackgroundFetch.finish(taskId);
}, (error) => {
  console.error('[BackgroundFetch] Error:', error);
});
```

---

## 10. Platform-Specific Features

### 10.1 iOS-Specific Features

**1. Siri Shortcuts:**
- "Add task in Fintrax"
- "Check my balance in Fintrax"
- "Show today's tasks"

**2. Home Screen Widgets:**
- Small: Balance + task count
- Medium: Today's tasks list
- Large: Financial chart

**3. 3D Touch / Haptic Touch:**
- Quick actions from home screen:
  - Add Task
  - Add Transaction
  - View Dashboard

**4. Share Extension:**
- Save links from Safari as task resources
- Share receipts from Photos to Fintrax

**5. Today Widget (Notification Center):**
- Quick task overview
- Add task button

**6. Face ID / Touch ID:**
- Biometric login
- Authorize sensitive operations (delete all data)

---

### 10.2 Android-Specific Features

**1. App Shortcuts:**
- Long-press app icon → Quick actions:
  - Add Task
  - Add Transaction
  - View Balance

**2. Home Screen Widgets:**
- 4x1: Quick stats
- 4x2: Task list + add button
- 4x3: Financial chart

**3. Google Assistant Actions:**
- "OK Google, add task in Fintrax"
- "OK Google, check my Fintrax balance"

**4. Notification Actions:**
- Task reminder notification:
  - [Complete] [Snooze 1h]

**5. App Standby Buckets:**
- Optimize background sync based on usage patterns

**6. Fingerprint / Face Unlock:**
- Biometric login
- Authorize financial operations

---

### 10.3 Tablet Support

**iPad (iOS):**
- Split-view support: Tasks on left, details on right
- Keyboard shortcuts (Command + N for new task)
- Drag & drop between projects

**Android Tablets:**
- Two-pane layout (master-detail)
- Floating Action Button (FAB) always visible

---

## 11. Development Roadmap

### 11.1 MVP (Phase 1) - 3 Months

**Month 1: Foundation**
- ✅ Project setup (React Native + Expo)
- ✅ Authentication screens (Login, Register, OTP)
- ✅ Bottom tab navigation
- ✅ API client with interceptors
- ✅ Redux store setup
- ✅ SQLite database setup
- ✅ Offline sync foundation

**Month 2: Core Features**
- ✅ Dashboard screen
- ✅ Task management (list, create, edit, delete)
- ✅ Project management (grid view, detail view)
- ✅ Finance tracking (transactions, balance)
- ✅ Kanban board (drag & drop)
- ✅ Pull-to-refresh, swipe gestures

**Month 3: Polish & Launch**
- ✅ Dark mode
- ✅ Push notifications
- ✅ Biometric authentication
- ✅ Home screen widgets (basic)
- ✅ Error handling & loading states
- ✅ Testing (unit, integration, E2E)
- ✅ Beta testing (TestFlight, Google Play Internal Testing)
- ✅ App Store / Play Store submission

---

### 11.2 Post-MVP (Phase 2) - 3-6 Months

**Enhancements:**
- Receipt scanning (OCR)
- Voice task creation (Siri Shortcuts, Google Assistant)
- Calendar integration
- Advanced charts & analytics
- Budgeting features
- Recurring transactions
- Export to PDF/CSV
- Multi-currency support (future)

**Platform Features:**
- iPad optimization (split-view)
- Android tablet support
- Wear OS app (smartwatch)
- Apple Watch app

---

### 11.3 Future Vision (Phase 3) - 6-12 Months

- Collaboration features (shared projects)
- AI-powered expense categorization
- Bank account integration (Plaid)
- Investment tracking
- Tax report generation
- Cross-platform desktop app (Electron)
- Web app parity

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
         ┌─────────────┐
         │     E2E     │  (10% - Critical flows)
         │   (Detox)   │
         └─────────────┘
      ┌──────────────────┐
      │   Integration    │  (20% - API, Redux)
      │      (Jest)      │
      └──────────────────┘
   ┌───────────────────────┐
   │      Unit Tests       │  (70% - Components, Utils)
   │        (Jest)         │
   └───────────────────────┘
```

---

### 12.2 Unit Tests (Jest)

**Coverage Target:** 80%

**Test Files:**
- `src/utils/__tests__/dateUtils.test.ts`
- `src/components/__tests__/TaskCard.test.tsx`
- `src/store/slices/__tests__/tasksSlice.test.ts`

**Example:**
```typescript
// dateUtils.test.ts
import { formatDate, isToday } from '../dateUtils';

describe('dateUtils', () => {
  test('formatDate formats date correctly', () => {
    const date = new Date('2025-11-14T10:30:00Z');
    expect(formatDate(date)).toBe('Nov 14, 2025');
  });

  test('isToday returns true for today', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });
});
```

---

### 12.3 Integration Tests (Jest)

**Focus:** API integration, Redux state management

**Example:**
```typescript
// tasksSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { addTask } from '../tasksSlice';

test('addTask adds task to state', () => {
  const store = configureStore({ reducer: { tasks: tasksReducer } });

  const task = { id: 1, title: 'Test Task', status: 1 };
  store.dispatch(addTask(task));

  const state = store.getState().tasks;
  expect(state.items).toContainEqual(task);
});
```

---

### 12.4 End-to-End Tests (Detox)

**Critical Flows:**
1. User registration → Email verification → Login
2. Create task → Edit task → Mark complete
3. Add transaction → View balance update
4. Offline mode → Create task → Go online → Verify sync

**Example:**
```typescript
// e2e/login.test.js
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('dashboard-screen'))).toBeVisible();
  });
});
```

---

### 12.5 Manual Testing Checklist

**Pre-Release:**
- [ ] Test on iOS (iPhone 8, 13, 15 Pro)
- [ ] Test on Android (API 26, 30, 34)
- [ ] Test on tablets (iPad, Samsung Tab)
- [ ] Test offline mode (airplane mode)
- [ ] Test push notifications
- [ ] Test biometric login (Face ID, Touch ID, Fingerprint)
- [ ] Test dark mode
- [ ] Test with slow network (3G simulation)
- [ ] Test with VoiceOver/TalkBack (accessibility)
- [ ] Test memory usage (Xcode Instruments, Android Profiler)
- [ ] Test battery drain (24h background test)

---

### 12.6 Beta Testing

**Platforms:**
- **iOS:** TestFlight (100 external testers)
- **Android:** Google Play Internal Testing (100 users)

**Feedback Collection:**
- In-app feedback form
- Crash reporting (Sentry)
- Analytics (Firebase Analytics)
- User surveys (Google Forms)

**Metrics:**
- Crash-free rate > 99%
- Average session duration > 3 minutes
- Daily active users > 40% of beta users
- Feature usage tracking

---

## Appendix A: API Endpoint Summary

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/user/register` | POST | Create new user | No |
| `/api/user/verify-email` | POST | Verify email with OTP | No |
| `/api/user/login` | POST | Authenticate user | No |
| `/api/user/forgot-password` | POST | Reset password with OTP | No |
| `/api/user/reset-password` | POST | Change password | Yes |
| `/api/todo` | GET | Get all tasks | Yes |
| `/api/todo` | POST | Create task | Yes |
| `/api/todo/:id` | GET | Get task by ID | Yes |
| `/api/todo/:id` | PATCH | Update task | Yes |
| `/api/todo/:id` | DELETE | Delete task | Yes |
| `/api/projects` | GET | Get all projects | Yes |
| `/api/projects` | POST | Create project | Yes |
| `/api/projects/:id` | GET | Get project by ID | Yes |
| `/api/projects/:id` | PATCH | Update project | Yes |
| `/api/projects/:id` | DELETE | Delete project | Yes |
| `/api/transactions` | GET | Get all transactions | Yes |
| `/api/transactions` | POST | Create transaction | Yes |
| `/api/transactions/:id` | PATCH | Update transaction | Yes |
| `/api/transactions/:id` | DELETE | Delete transaction | Yes |
| `/api/savings` | GET | Get all savings | Yes |
| `/api/loans` | GET | Get all loans | Yes |
| `/api/dashboard` | GET | Get dashboard summary | Yes |
| `/api/sync` | GET | Delta sync (query param: last_sync) | Yes |

---

## Appendix B: Dependencies

**Core:**
```json
{
  "react": "18.2.0",
  "react-native": "0.73.0",
  "expo": "~50.0.0",
  "typescript": "^5.3.0"
}
```

**Navigation:**
```json
{
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-navigation/bottom-tabs": "^6.5.0"
}
```

**State Management:**
```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "react-redux": "^9.0.0",
  "redux-persist": "^6.0.0"
}
```

**UI Components:**
```json
{
  "react-native-paper": "^5.11.0",
  "react-native-vector-icons": "^10.0.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-gesture-handler": "^2.14.0",
  "react-native-reanimated": "^3.6.0"
}
```

**Data & Storage:**
```json
{
  "expo-sqlite": "~13.0.0",
  "expo-secure-store": "~12.8.0",
  "@react-native-async-storage/async-storage": "^1.21.0"
}
```

**Networking:**
```json
{
  "axios": "^1.6.0",
  "@react-native-community/netinfo": "^11.0.0"
}
```

**Device Features:**
```json
{
  "expo-camera": "~14.0.0",
  "expo-local-authentication": "~13.8.0",
  "expo-notifications": "~0.27.0",
  "expo-haptics": "~12.8.0"
}
```

---

## Appendix C: Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] API endpoints tested in staging
- [ ] Performance profiling completed (launch time < 2s)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Security review completed
- [ ] App size optimized (< 50 MB)
- [ ] Privacy policy and terms of service finalized
- [ ] App icons and splash screens designed (all sizes)
- [ ] Screenshots prepared (App Store / Play Store)

**iOS Submission (App Store Connect):**
- [ ] Apple Developer account enrolled ($99/year)
- [ ] App ID created in Developer Portal
- [ ] Provisioning profiles configured
- [ ] App Store Connect app created
- [ ] Build uploaded via Xcode or Transporter
- [ ] Screenshots uploaded (5.5", 6.5", 12.9" iPad)
- [ ] App description, keywords, category set
- [ ] Privacy policy URL provided
- [ ] Age rating questionnaire completed
- [ ] Submitted for review

**Android Submission (Google Play Console):**
- [ ] Google Play Developer account created ($25 one-time)
- [ ] App bundle (.aab) built and signed
- [ ] App uploaded to production track
- [ ] Screenshots uploaded (phone, tablet, 7", 10")
- [ ] App description, category, tags set
- [ ] Privacy policy URL provided
- [ ] Content rating questionnaire completed
- [ ] Pricing and distribution configured
- [ ] Submitted for review

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 14, 2025 | AI Assistant | Initial mobile design document |

---

**End of Mobile Application Design Document**
