# FINTRAX MOBILE APP SPRINT PLAN
**12-Week Development Roadmap to MVP Launch**

---

## EXECUTIVE SUMMARY

**Current Status:** Mobile App - Starting from Scratch (0% Complete)
- **Platform:** React Native with Expo (Cross-platform iOS & Android)
- **Timeline:** 12 weeks (6 sprints of 2 weeks each)
- **Team Velocity:** Assume 40 story points per sprint
- **Backend:** Existing Go/Gin API (ready to use)

**Critical Path:**
1. Foundation & Authentication (Sprints 1-2)
2. Core Features - Tasks & Finance (Sprints 2-4)
3. Offline Sync & Polish (Sprints 4-5)
4. Testing & Launch Prep (Sprint 6)

**Total Story Points:** 240 across 6 sprints

---

## TABLE OF CONTENTS

1. [Sprint 1: Project Setup & Authentication](#sprint-1-project-setup--authentication-weeks-1-2)
2. [Sprint 2: Core Navigation & Task Management](#sprint-2-core-navigation--task-management-weeks-3-4)
3. [Sprint 3: Finance Management & Charts](#sprint-3-finance-management--charts-weeks-5-6)
4. [Sprint 4: Offline Sync & Project Management](#sprint-4-offline-sync--project-management-weeks-7-8)
5. [Sprint 5: Biometrics, Notifications & Polish](#sprint-5-biometrics-notifications--polish-weeks-9-10)
6. [Sprint 6: Testing, Beta Launch & App Store Submission](#sprint-6-testing-beta-launch--app-store-submission-weeks-11-12)
7. [Risk Mitigation](#risk-mitigation-strategies)
8. [Definition of Done](#definition-of-done)
9. [Success Metrics](#success-metrics)

---

## SPRINT 1: PROJECT SETUP & AUTHENTICATION (Weeks 1-2)

**Goal:** Establish project foundation and implement complete authentication flow

**Story Points:** 38
**Estimated Hours:** 76h
**Team Capacity:** 80h
**Buffer:** 4h for unknowns

### User Stories

#### US-1.1: Project Setup & Configuration

**As a** developer
**I want to** set up the React Native project with all necessary dependencies
**So that** the team can start building features on a solid foundation

**Story Points:** 5
**Estimated Hours:** 10h

**Technical Tasks:**
1. Initialize Expo project with TypeScript template
2. Configure ESLint, Prettier, and TypeScript settings
3. Set up folder structure (screens, components, navigation, etc.)
4. Install core dependencies (navigation, Redux, axios, etc.)
5. Configure environment variables (.env.development, .env.production)
6. Set up Git repository and .gitignore
7. Configure iOS and Android build settings
8. Create README.md with setup instructions

**Acceptance Criteria:**
- [ ] Project runs on iOS simulator without errors
- [ ] Project runs on Android emulator without errors
- [ ] All team members can clone and run the project
- [ ] ESLint and Prettier are enforcing code style
- [ ] Environment variables are properly configured
- [ ] Folder structure matches mobile design document

**Dependencies:** None
**Risk:** Low

**Files to Create:**
- `package.json` (with all dependencies)
- `tsconfig.json`
- `.eslintrc.js`
- `.prettierrc`
- `app.json` (Expo configuration)
- `src/` folder structure

**Technical Notes:**
- Use Expo SDK 50+
- React Native 0.73+
- TypeScript 5.x
- Node.js 20+

---

#### US-1.2: API Client Configuration

**As a** developer
**I want to** configure Axios HTTP client with interceptors
**So that** all API requests include authentication and proper error handling

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Create Axios instance with base URL configuration
2. Implement request interceptor to add JWT token
3. Implement response interceptor for error handling
4. Create retry logic for failed requests (exponential backoff)
5. Add network connectivity check before requests
6. Create API endpoint modules (auth.api.ts, tasks.api.ts, etc.)
7. Implement request/response logging (development only)

**Acceptance Criteria:**
- [ ] API client includes JWT token in all authenticated requests
- [ ] 401 errors trigger automatic logout
- [ ] Network errors are caught and displayed to user
- [ ] Failed requests retry up to 3 times with exponential backoff
- [ ] API endpoints are organized by domain
- [ ] Request/response logs visible in development mode

**Dependencies:** US-1.1
**Risk:** Low

**Files to Create:**
- `src/api/client.ts`
- `src/api/auth.api.ts`
- `src/api/tasks.api.ts`
- `src/api/finance.api.ts`
- `src/api/projects.api.ts`
- `src/constants/api.ts`

**Technical Notes:**
- Base URL: `http://localhost:80/api` (development)
- Production URL from environment variable
- Use axios-retry for retry logic
- Integrate @react-native-community/netinfo for connectivity

---

#### US-1.3: Redux Store Setup

**As a** developer
**I want to** configure Redux Toolkit for state management
**So that** app state is predictable and testable

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Install Redux Toolkit and React Redux
2. Create store configuration with middleware
3. Set up Redux Persist for state persistence
4. Create auth slice (user, token, isAuthenticated)
5. Create UI slice (loading, error, toast messages)
6. Configure Redux DevTools for development
7. Create hooks (useAppDispatch, useAppSelector)

**Acceptance Criteria:**
- [ ] Redux store is properly configured
- [ ] Redux Persist saves state to AsyncStorage
- [ ] Auth state persists across app restarts
- [ ] Redux DevTools work in development
- [ ] TypeScript types are properly defined
- [ ] Custom hooks simplify component usage

**Dependencies:** US-1.1
**Risk:** Low

**Files to Create:**
- `src/store/index.ts`
- `src/store/slices/authSlice.ts`
- `src/store/slices/uiSlice.ts`
- `src/hooks/useAppDispatch.ts`
- `src/hooks/useAppSelector.ts`

**Technical Notes:**
- Use Redux Toolkit createSlice
- Configure Redux Persist with AsyncStorage
- Add custom middleware for logging (development only)

---

#### US-1.4: Login Screen UI

**As a** user
**I want to** see a beautiful login screen
**So that** I can enter my credentials to access the app

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Create LoginScreen component
2. Design UI with email and password inputs
3. Add password visibility toggle
4. Implement "Remember Me" checkbox
5. Add "Forgot Password" link
6. Add "Sign Up" link
7. Add loading spinner during login
8. Implement form validation (email format, required fields)

**Acceptance Criteria:**
- [ ] Login screen matches design mockup
- [ ] Email input validates email format
- [ ] Password input has visibility toggle
- [ ] All interactive elements have proper touch targets (44x44pt)
- [ ] Form validation shows error messages
- [ ] Screen is responsive on different devices
- [ ] Keyboard doesn't overlap input fields (KeyboardAvoidingView)

**Dependencies:** US-1.1
**Risk:** Low

**Files to Create:**
- `src/screens/auth/LoginScreen.tsx`
- `src/components/common/InputField.tsx`
- `src/components/common/Button.tsx`
- `src/utils/validators.ts`

**Technical Notes:**
- Use React Native Paper or React Native Elements for UI components
- Implement KeyboardAvoidingView for iOS
- Use Formik or React Hook Form for form management (optional)

---

#### US-1.5: Login API Integration

**As a** user
**I want to** login with my email and password
**So that** I can access my tasks and financial data

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Create login API call function
2. Dispatch Redux action on login button press
3. Handle successful login (save JWT token)
4. Handle login errors (invalid credentials, network errors)
5. Navigate to Dashboard on successful login
6. Save token to Expo SecureStore
7. Implement "Remember Me" functionality
8. Add loading state during API call

**Acceptance Criteria:**
- [ ] Login API call works with correct credentials
- [ ] JWT token is saved to SecureStore on success
- [ ] User is redirected to Dashboard after login
- [ ] Error messages are displayed for failed login
- [ ] Loading spinner shows during API call
- [ ] "Remember Me" saves email to AsyncStorage
- [ ] Token is included in subsequent API requests

**Dependencies:** US-1.2, US-1.3, US-1.4
**Risk:** Medium - Depends on backend API availability

**Files to Modify:**
- `src/screens/auth/LoginScreen.tsx`
- `src/api/auth.api.ts`
- `src/store/slices/authSlice.ts`

**Technical Notes:**
- Backend endpoint: POST `/api/user/login`
- Request: `{ email, password }`
- Response: `{ token, user_id, email, username }`
- Save token with expo-secure-store

---

#### US-1.6: Register Screen & Email Verification

**As a** new user
**I want to** create an account and verify my email
**So that** I can start using Fintrax

**Story Points:** 8
**Estimated Hours:** 14h

**Technical Tasks:**
1. Create RegisterScreen component
2. Add form fields (username, email, password)
3. Add password strength indicator
4. Implement registration API call
5. Create OTP verification screen
6. Implement OTP input (4-digit code)
7. Add resend OTP functionality with countdown timer
8. Handle registration and verification errors

**Acceptance Criteria:**
- [ ] Registration form validates all inputs
- [ ] Password strength indicator works correctly
- [ ] Registration creates user account
- [ ] OTP is sent to user's email
- [ ] OTP verification screen displays after registration
- [ ] User can resend OTP after cooldown period
- [ ] Successful verification navigates to Dashboard
- [ ] Error messages are clear and actionable

**Dependencies:** US-1.2, US-1.3
**Risk:** Medium - OTP email delivery depends on backend

**Files to Create:**
- `src/screens/auth/RegisterScreen.tsx`
- `src/screens/auth/OTPVerificationScreen.tsx`
- `src/components/common/PasswordStrengthIndicator.tsx`
- `src/components/common/OTPInput.tsx`

**Technical Notes:**
- Backend endpoints:
  - POST `/api/user/register` → Returns user + token
  - POST `/api/user/verify-email` → Verifies OTP
- OTP is 4-digit number (1000-9999)
- OTP valid for 5 minutes

---

#### US-1.7: Forgot Password Flow

**As a** user
**I want to** reset my password if I forget it
**So that** I can regain access to my account

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Create ForgotPasswordScreen
2. Add email input
3. Implement generate OTP API call
4. Create ResetPasswordScreen with OTP + new password
5. Implement reset password API call
6. Add success confirmation
7. Navigate to Login after successful reset

**Acceptance Criteria:**
- [ ] User can request password reset OTP
- [ ] OTP is sent to user's email
- [ ] User can enter OTP and new password
- [ ] Password is successfully reset
- [ ] User is redirected to login screen
- [ ] Error messages display for invalid OTP

**Dependencies:** US-1.2, US-1.3
**Risk:** Low

**Files to Create:**
- `src/screens/auth/ForgotPasswordScreen.tsx`
- `src/screens/auth/ResetPasswordScreen.tsx`

**Technical Notes:**
- Backend endpoints:
  - POST `/api/user/generate-otp` → Sends OTP to email
  - POST `/api/user/forgot-password` → Resets password with OTP

---

### Sprint 1 Testing Requirements

**Unit Tests:**
- [ ] API client interceptors
- [ ] Redux slices (auth, UI)
- [ ] Form validation functions
- [ ] Password strength calculation

**Integration Tests:**
- [ ] Login flow (UI → API → Redux → Navigation)
- [ ] Registration + OTP flow
- [ ] Forgot password flow

**Manual Testing:**
- [ ] Test on iOS simulator (iPhone 13, 15)
- [ ] Test on Android emulator (API 30, 34)
- [ ] Test with slow network (3G simulation)
- [ ] Test offline behavior (error messages)

**Estimated Testing Hours:** 8h

---

### Sprint 1 Summary

**Deliverables:**
- ✅ React Native project setup with TypeScript
- ✅ API client with interceptors and error handling
- ✅ Redux store with auth and UI slices
- ✅ Complete authentication flow (Login, Register, OTP, Forgot Password)
- ✅ Form validation and error handling
- ✅ JWT token management with SecureStore

---

## SPRINT 2: CORE NAVIGATION & TASK MANAGEMENT (Weeks 3-4)

**Goal:** Implement bottom tab navigation and complete task management features

**Story Points:** 42
**Estimated Hours:** 80h
**Team Capacity:** 80h
**Buffer:** 0h (at capacity - may need to defer US-2.7)

### User Stories

#### US-2.1: Bottom Tab Navigation

**As a** user
**I want to** navigate between main sections using bottom tabs
**So that** I can quickly access Dashboard, Tasks, Finance, and More

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Install React Navigation (bottom-tabs, stack)
2. Create MainNavigator with bottom tabs
3. Create placeholder screens (Dashboard, Tasks, Finance, More)
4. Configure tab bar icons and labels
5. Implement stack navigator for each tab
6. Add navigation transitions
7. Configure deep linking (future)

**Acceptance Criteria:**
- [ ] Bottom tab bar displays on all main screens
- [ ] Tabs have icons and labels
- [ ] Active tab is highlighted
- [ ] Tapping tab navigates to correct screen
- [ ] Tab bar hides when keyboard is open
- [ ] Stack navigation works within each tab
- [ ] Platform-specific styling (iOS vs Android)

**Dependencies:** Sprint 1 (Auth)
**Risk:** Low

**Files to Create:**
- `src/navigation/MainNavigator.tsx`
- `src/navigation/TabNavigator.tsx`
- `src/screens/dashboard/DashboardScreen.tsx` (placeholder)
- `src/screens/tasks/TaskListScreen.tsx` (placeholder)
- `src/screens/finance/FinanceScreen.tsx` (placeholder)
- `src/screens/more/MoreScreen.tsx` (placeholder)

**Technical Notes:**
- Use React Navigation 6.x
- Use react-native-vector-icons for tab icons
- iOS: Tab bar at bottom, Android: Can use drawer as alternative

---

#### US-2.2: Dashboard Screen UI

**As a** user
**I want to** see an overview of my tasks and finances on the dashboard
**So that** I can quickly understand my current status

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Design dashboard layout with cards
2. Create Welcome header with greeting
3. Add financial summary card (balance, net worth)
4. Add quick action buttons (Add Task, Add Transaction)
5. Create recent tasks widget (top 5)
6. Create recent transactions widget (top 5)
7. Implement pull-to-refresh
8. Add loading states

**Acceptance Criteria:**
- [ ] Dashboard displays time-based greeting (Good Morning, etc.)
- [ ] Financial summary shows balance and net worth
- [ ] Quick action buttons are prominent and functional
- [ ] Recent tasks display with priority indicators
- [ ] Recent transactions show with category icons
- [ ] Pull-to-refresh fetches latest data
- [ ] Loading skeleton shows during data fetch
- [ ] Empty states display when no data

**Dependencies:** US-2.1
**Risk:** Low

**Files to Create:**
- `src/screens/dashboard/DashboardScreen.tsx`
- `src/components/dashboard/WelcomeHeader.tsx`
- `src/components/dashboard/FinancialSummaryCard.tsx`
- `src/components/dashboard/QuickActions.tsx`
- `src/components/dashboard/RecentTasksWidget.tsx`
- `src/components/dashboard/RecentTransactionsWidget.tsx`

---

#### US-2.3: Task List Screen

**As a** user
**I want to** view all my tasks in a list
**So that** I can see what needs to be done

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Create TaskListScreen with FlatList
2. Create TaskCard component
3. Add filters (All, Priority, Status, Project)
4. Implement search functionality
5. Add sorting options (due date, priority, created date)
6. Implement swipe actions (complete, delete)
7. Add view switcher (List, Kanban, Calendar) - List only for now
8. Show empty state when no tasks

**Acceptance Criteria:**
- [ ] All tasks display in scrollable list
- [ ] Task cards show title, priority, due date, project
- [ ] Filters work correctly (status, priority, project)
- [ ] Search filters tasks by title/description
- [ ] Swipe right marks task complete (green background)
- [ ] Swipe left shows delete action (red background)
- [ ] Priority is color-coded (red=high, yellow=medium, green=low)
- [ ] Empty state shows "No tasks" message

**Dependencies:** US-2.1
**Risk:** Medium - Swipe gestures can be tricky

**Files to Create:**
- `src/screens/tasks/TaskListScreen.tsx`
- `src/components/tasks/TaskCard.tsx`
- `src/components/tasks/TaskFilters.tsx`
- `src/components/common/SearchBar.tsx`

**Technical Notes:**
- Use react-native-gesture-handler for swipe
- FlatList optimizations: getItemLayout, maxToRenderPerBatch
- Use React Native Reanimated for smooth swipe animations

---

#### US-2.4: Create Task Flow

**As a** user
**I want to** create new tasks
**So that** I can track my work

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Create AddTaskScreen (modal or bottom sheet)
2. Add form fields (title, description, priority, due date, project)
3. Implement date picker for due date
4. Add project selector dropdown
5. Implement priority selector (1-5)
6. Create task API call
7. Add to Redux store and local SQLite
8. Navigate back to task list after save
9. Show success toast notification

**Acceptance Criteria:**
- [ ] Add Task screen opens from FAB or quick action
- [ ] Title is required field
- [ ] Priority selector shows 1-5 with labels
- [ ] Date picker opens calendar
- [ ] Project selector shows user's projects
- [ ] Task is created in backend via API
- [ ] Task appears in task list immediately
- [ ] Success toast shows confirmation
- [ ] Form resets after save

**Dependencies:** US-2.3
**Risk:** Medium - Multi-step form

**Files to Create:**
- `src/screens/tasks/AddTaskScreen.tsx`
- `src/components/common/DatePicker.tsx`
- `src/components/common/PrioritySelector.tsx`
- `src/components/common/ProjectSelector.tsx`

**Technical Notes:**
- Backend endpoint: POST `/api/todo`
- Request body: `{ title, description, priority, due_days, start_date, end_date, project_id }`
- Use @react-native-community/datetimepicker

---

#### US-2.5: Task Detail & Edit

**As a** user
**I want to** view and edit task details
**So that** I can update task information

**Story Points:** 5
**Estimated Hours:** 10h

**Technical Tasks:**
1. Create TaskDetailScreen
2. Display all task fields (read-only initially)
3. Add Edit button
4. Enable editing of all fields
5. Implement update API call
6. Add subtask management (future - placeholder for now)
7. Show task resources (future - placeholder)
8. Add delete task functionality

**Acceptance Criteria:**
- [ ] Task detail screen shows all task information
- [ ] Edit button enables form editing
- [ ] All fields are editable
- [ ] Save button updates task via API
- [ ] Changes reflect in task list immediately
- [ ] Delete button shows confirmation dialog
- [ ] Deleted tasks are soft-deleted (status = 5)

**Dependencies:** US-2.3, US-2.4
**Risk:** Low

**Files to Create:**
- `src/screens/tasks/TaskDetailScreen.tsx`

**Technical Notes:**
- Backend endpoint: PATCH `/api/todo/:id`
- Soft delete: Update status to 5 (STATUS_DELETED)

---

#### US-2.6: Tasks API Integration & Redux

**As a** developer
**I want to** integrate tasks with backend API and Redux
**So that** task data is synced with the server

**Story Points:** 5
**Estimated Hours:** 10h

**Technical Tasks:**
1. Create tasksSlice in Redux
2. Implement API calls (getAll, create, update, delete)
3. Add loading and error states
4. Implement optimistic updates (update UI before API call)
5. Handle API errors gracefully
6. Add success/error toast notifications
7. Update dashboard widgets after task changes

**Acceptance Criteria:**
- [ ] Tasks fetch from API on app launch
- [ ] Creating task updates Redux and calls API
- [ ] Updating task updates Redux and calls API
- [ ] Deleting task updates Redux and calls API
- [ ] Loading states display during API calls
- [ ] Error toasts show on API failures
- [ ] Optimistic updates make UI feel instant

**Dependencies:** US-2.3, US-2.4, US-2.5
**Risk:** Low

**Files to Create:**
- `src/store/slices/tasksSlice.ts`

**Technical Notes:**
- Use RTK Query or Redux Thunk for async actions
- Implement retry logic for failed API calls
- Cache tasks in Redux for offline viewing

---

#### US-2.7: Task Swipe Gestures & Animations

**As a** user
**I want to** swipe tasks to complete or delete them
**So that** I can quickly manage tasks with one hand

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Implement swipe-to-complete (swipe right)
2. Implement swipe-to-delete (swipe left)
3. Add swipe animations (background color change)
4. Add haptic feedback on swipe complete
5. Show confirmation dialog for delete
6. Update task status on swipe

**Acceptance Criteria:**
- [ ] Swipe right shows green "Complete" background
- [ ] Swipe left shows red "Delete" background
- [ ] Completing swipe updates task status to 6 (Completed)
- [ ] Deleting swipe shows confirmation dialog
- [ ] Haptic feedback vibrates on action
- [ ] Animations are smooth (60fps)

**Dependencies:** US-2.3
**Risk:** Medium - Gesture conflicts with scrolling

**Files to Modify:**
- `src/components/tasks/TaskCard.tsx`

**Technical Notes:**
- Use react-native-gesture-handler Swipeable
- Use expo-haptics for vibration
- Threshold: 50% swipe to trigger action

---

### Sprint 2 Testing Requirements

**Unit Tests:**
- [ ] tasksSlice reducers and actions
- [ ] Task filtering logic
- [ ] Task sorting logic
- [ ] Form validation

**Integration Tests:**
- [ ] Create task flow (UI → API → Redux → List)
- [ ] Edit task flow
- [ ] Delete task flow
- [ ] Swipe gestures

**Manual Testing:**
- [ ] Test on iOS (iPhone 13, 15)
- [ ] Test on Android (Pixel 5, Samsung S21)
- [ ] Test swipe gestures (smooth animations)
- [ ] Test with 100+ tasks (performance)

**Estimated Testing Hours:** 10h

---

### Sprint 2 Summary

**Deliverables:**
- ✅ Bottom tab navigation (Dashboard, Tasks, Finance, More)
- ✅ Dashboard with financial summary and recent items
- ✅ Complete task management (list, create, edit, delete)
- ✅ Task filters and search
- ✅ Swipe gestures for task actions
- ✅ API integration with Redux

---

## SPRINT 3: FINANCE MANAGEMENT & CHARTS (Weeks 5-6)

**Goal:** Build finance tracking features with transaction management and charts

**Story Points:** 40
**Estimated Hours:** 76h
**Team Capacity:** 80h
**Buffer:** 4h

### User Stories

#### US-3.1: Finance Dashboard Screen

**As a** user
**I want to** see my financial overview
**So that** I can understand my financial health

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Create FinanceScreen layout
2. Add balance summary card
3. Create income vs expense summary (this month)
4. Add quick action buttons (Add Transaction, View Reports)
5. Implement pull-to-refresh
6. Show recent transactions (last 10)
7. Add navigation to detailed views

**Acceptance Criteria:**
- [ ] Balance card displays current balance
- [ ] Monthly summary shows income, expenses, net
- [ ] Quick actions navigate to add transaction
- [ ] Recent transactions list shows last 10 items
- [ ] Pull-to-refresh updates data
- [ ] Tapping transaction opens detail screen
- [ ] Charts display (placeholder for US-3.4)

**Dependencies:** Sprint 2
**Risk:** Low

**Files to Create:**
- `src/screens/finance/FinanceScreen.tsx`
- `src/components/finance/BalanceCard.tsx`
- `src/components/finance/MonthlySummary.tsx`

---

#### US-3.2: Add Transaction Flow

**As a** user
**I want to** record income and expenses
**So that** I can track my cash flow

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Create AddTransactionScreen (bottom sheet)
2. Add type toggle (Income / Expense)
3. Add amount input with number pad
4. Create category picker with icons
5. Add source/description input
6. Implement date picker (default: today)
7. Add optional camera button (placeholder for receipt scan)
8. Create transaction API call
9. Update balance after transaction

**Acceptance Criteria:**
- [ ] Screen opens as bottom sheet from FAB
- [ ] Type toggle switches between income/expense
- [ ] Amount input shows large number pad
- [ ] Category picker shows predefined categories with icons
- [ ] Date picker defaults to today
- [ ] Transaction creates successfully via API
- [ ] Balance updates immediately
- [ ] Success toast confirms save
- [ ] Form resets after save

**Dependencies:** US-3.1
**Risk:** Low

**Files to Create:**
- `src/screens/finance/AddTransactionScreen.tsx`
- `src/components/finance/CategoryPicker.tsx`
- `src/components/common/AmountInput.tsx`
- `src/constants/financeCategories.ts`

**Technical Notes:**
- Backend endpoint: POST `/api/transactions`
- Categories: Food, Transport, Housing, Entertainment, Shopping, Healthcare, etc.
- Transaction types: 1=Income, 2=Expense

---

#### US-3.3: Transaction List & Filters

**As a** user
**I want to** view and filter my transactions
**So that** I can review my spending history

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Create TransactionListScreen
2. Create TransactionCard component
3. Implement filters (date range, type, category)
4. Add search functionality
5. Implement swipe-to-delete
6. Group transactions by date
7. Add edit transaction functionality
8. Show empty state

**Acceptance Criteria:**
- [ ] All transactions display in chronological order (newest first)
- [ ] Transactions grouped by date (Today, Yesterday, This Week, etc.)
- [ ] Filter by date range (This Month, Last Month, Custom)
- [ ] Filter by type (Income, Expense, All)
- [ ] Filter by category (multiple selection)
- [ ] Swipe left deletes transaction (with confirmation)
- [ ] Tap transaction to edit
- [ ] Search filters by source/description
- [ ] Empty state shows "No transactions"

**Dependencies:** US-3.2
**Risk:** Low

**Files to Create:**
- `src/screens/finance/TransactionListScreen.tsx`
- `src/components/finance/TransactionCard.tsx`
- `src/components/finance/TransactionFilters.tsx`

**Technical Notes:**
- Backend endpoint: GET `/api/transactions`
- Supports query params for filtering
- Use SectionList for date grouping

---

#### US-3.4: Financial Charts

**As a** user
**I want to** visualize my financial data with charts
**So that** I can understand spending patterns

**Story Points:** 8
**Estimated Hours:** 14h

**Technical Tasks:**
1. Install react-native-chart-kit or Victory Native
2. Create IncomeExpenseChart (line chart)
3. Create CategoryPieChart (pie chart for expenses)
4. Create BalanceTrendChart (area chart)
5. Add time period selector (1M, 3M, 6M, 1Y)
6. Implement data aggregation logic
7. Add chart tooltips
8. Make charts responsive

**Acceptance Criteria:**
- [ ] Income vs Expense chart shows monthly trend
- [ ] Category pie chart shows expense breakdown by category
- [ ] Balance trend chart shows balance over time
- [ ] Time period selector filters chart data
- [ ] Charts are interactive (tap to see details)
- [ ] Charts render on different screen sizes
- [ ] Loading state while calculating data
- [ ] Empty state when no data

**Dependencies:** US-3.1, US-3.3
**Risk:** Medium - Chart library setup and data transformation

**Files to Create:**
- `src/components/finance/IncomeExpenseChart.tsx`
- `src/components/finance/CategoryPieChart.tsx`
- `src/components/finance/BalanceTrendChart.tsx`
- `src/utils/chartDataProcessors.ts`

**Technical Notes:**
- Use react-native-chart-kit (simpler) or Victory Native (more powerful)
- Aggregate transactions by month for trend charts
- Calculate percentages for pie chart

---

#### US-3.5: Finance API Integration & Redux

**As a** developer
**I want to** integrate finance with backend API and Redux
**So that** financial data is synced with the server

**Story Points:** 5
**Estimated Hours:** 10h

**Technical Tasks:**
1. Create financeSlice in Redux
2. Implement API calls (getTransactions, createTransaction, etc.)
3. Add balance calculation logic
4. Implement optimistic updates
5. Handle API errors
6. Update dashboard widgets after changes

**Acceptance Criteria:**
- [ ] Transactions fetch from API on screen mount
- [ ] Creating transaction updates Redux and API
- [ ] Deleting transaction updates Redux and API
- [ ] Balance recalculates after changes
- [ ] Loading states display during API calls
- [ ] Error toasts show on failures
- [ ] Dashboard balance updates after transaction changes

**Dependencies:** US-3.2, US-3.3
**Risk:** Low

**Files to Create:**
- `src/store/slices/financeSlice.ts`

**Technical Notes:**
- Backend endpoints:
  - GET `/api/transactions`
  - POST `/api/transactions`
  - PATCH `/api/transactions/:id`
  - DELETE `/api/transactions/:id`
  - GET `/api/dashboard` (for balance)

---

#### US-3.6: Savings & Loans Screens (View Only)

**As a** user
**I want to** view my savings and loans
**So that** I can track my financial goals and debts

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Create SavingsScreen (list view)
2. Create LoansScreen (list view)
3. Display savings with progress bars
4. Display loans with payment info
5. Add navigation from Finance screen
6. Implement API integration (GET only for now)

**Acceptance Criteria:**
- [ ] Savings screen displays all savings
- [ ] Each saving shows name, amount, interest rate
- [ ] Progress bar shows growth (if target amount exists)
- [ ] Loans screen displays all loans
- [ ] Each loan shows name, amount, EMI, remaining balance
- [ ] Data fetches from API
- [ ] Empty states display when no data
- [ ] Add/Edit deferred to future sprint

**Dependencies:** US-3.1
**Risk:** Low

**Files to Create:**
- `src/screens/finance/SavingsScreen.tsx`
- `src/screens/finance/LoansScreen.tsx`
- `src/components/finance/SavingsCard.tsx`
- `src/components/finance/LoanCard.tsx`

**Technical Notes:**
- Backend endpoints:
  - GET `/api/savings`
  - GET `/api/loans`
- Full CRUD deferred to post-MVP

---

### Sprint 3 Testing Requirements

**Unit Tests:**
- [ ] financeSlice reducers
- [ ] Chart data processors
- [ ] Balance calculation
- [ ] Transaction filtering

**Integration Tests:**
- [ ] Create transaction flow
- [ ] Delete transaction flow
- [ ] Filter transactions
- [ ] Chart data rendering

**Manual Testing:**
- [ ] Test charts on different screen sizes
- [ ] Test with large datasets (1000+ transactions)
- [ ] Test date range filters
- [ ] Test category picker

**Estimated Testing Hours:** 10h

---

### Sprint 3 Summary

**Deliverables:**
- ✅ Finance dashboard with balance and summaries
- ✅ Transaction management (create, list, filter, delete)
- ✅ Financial charts (income/expense trends, category breakdown)
- ✅ Savings and loans viewing
- ✅ API integration with Redux

---

## SPRINT 4: OFFLINE SYNC & PROJECT MANAGEMENT (Weeks 7-8)

**Goal:** Implement offline-first architecture and project management features

**Story Points:** 42
**Estimated Hours:** 80h
**Team Capacity:** 80h
**Buffer:** 0h (at capacity)

### User Stories

#### US-4.1: SQLite Database Setup

**As a** developer
**I want to** set up SQLite for local data storage
**So that** the app works offline

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Install expo-sqlite
2. Create database initialization script
3. Define table schemas (tasks, transactions, projects, sync_queue)
4. Create database helper functions (CRUD operations)
5. Implement database migrations
6. Add indexes for performance
7. Test database operations

**Acceptance Criteria:**
- [ ] SQLite database initializes on app launch
- [ ] All tables are created with correct schemas
- [ ] CRUD operations work for all entities
- [ ] Indexes improve query performance
- [ ] Database version management works
- [ ] No data loss during migrations

**Dependencies:** None
**Risk:** Medium - Database schema design

**Files to Create:**
- `src/database/db.ts`
- `src/database/schemas.ts`
- `src/database/migrations.ts`
- `src/database/helpers/taskHelpers.ts`
- `src/database/helpers/transactionHelpers.ts`
- `src/database/helpers/syncHelpers.ts`

**Technical Notes:**
- Tables: users, tasks, projects, transactions, sync_queue
- Use prepared statements to prevent SQL injection
- Foreign key constraints enabled

---

#### US-4.2: Offline Sync Queue

**As a** developer
**I want to** queue offline changes for later sync
**So that** users can work without internet

**Story Points:** 13
**Estimated Hours:** 20h

**Technical Tasks:**
1. Create sync_queue table in SQLite
2. Implement queue management (add, remove, process)
3. Create sync middleware for Redux actions
4. Implement background sync worker
5. Add network status detection
6. Implement exponential backoff for retries
7. Handle sync conflicts (last-write-wins)
8. Show sync status indicator in UI

**Acceptance Criteria:**
- [ ] Offline changes are added to sync queue
- [ ] Queue processes automatically when online
- [ ] Failed syncs retry with exponential backoff
- [ ] Maximum 5 retry attempts
- [ ] Sync conflicts resolve with last-write-wins
- [ ] Sync status shows in app bar (synced, syncing, error)
- [ ] User can manually trigger sync
- [ ] Sync works in background (when app is open)

**Dependencies:** US-4.1
**Risk:** High - Complex sync logic and conflict resolution

**Files to Create:**
- `src/services/syncService.ts`
- `src/store/middleware/syncMiddleware.ts`
- `src/hooks/useOfflineSync.ts`
- `src/components/common/SyncStatusIndicator.tsx`

**Technical Notes:**
- sync_queue table: `{ id, entity_type, entity_id, action, payload, retry_count, created_at }`
- Actions: 'create', 'update', 'delete'
- Process queue every 30 seconds when online
- Use @react-native-community/netinfo for network status

---

#### US-4.3: Offline Mode - Tasks

**As a** user
**I want to** create and edit tasks offline
**So that** I can work without internet

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Modify task creation to save to SQLite first
2. Modify task editing to update SQLite
3. Modify task deletion to mark deleted in SQLite
4. Add "is_synced" flag to tasks
5. Show sync status per task (optional)
6. Read tasks from SQLite on app launch
7. Sync tasks when online

**Acceptance Criteria:**
- [ ] Tasks created offline save to SQLite
- [ ] Tasks edited offline update in SQLite
- [ ] Tasks deleted offline mark as deleted
- [ ] Task list reads from SQLite (instant load)
- [ ] Offline tasks sync when online
- [ ] No data loss during offline usage
- [ ] Sync status visible (optional icon on task card)

**Dependencies:** US-4.1, US-4.2
**Risk:** Medium

**Files to Modify:**
- `src/store/slices/tasksSlice.ts`
- `src/screens/tasks/TaskListScreen.tsx`

**Technical Notes:**
- Always write to SQLite first, then API
- Read from SQLite for instant UI
- Background sync updates SQLite with server data

---

#### US-4.4: Offline Mode - Transactions

**As a** user
**I want to** record transactions offline
**So that** I can track expenses without internet

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Modify transaction creation to save to SQLite
2. Modify transaction deletion to mark deleted
3. Read transactions from SQLite
4. Sync transactions when online

**Acceptance Criteria:**
- [ ] Transactions created offline save to SQLite
- [ ] Transaction list reads from SQLite
- [ ] Offline transactions sync when online
- [ ] Balance calculates from local transactions

**Dependencies:** US-4.1, US-4.2
**Risk:** Low

**Files to Modify:**
- `src/store/slices/financeSlice.ts`
- `src/screens/finance/FinanceScreen.tsx`

---

#### US-4.5: Projects List Screen

**As a** user
**I want to** view all my projects
**So that** I can navigate to project details

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Create ProjectsScreen (grid or list view)
2. Create ProjectCard component with color coding
3. Display project name, task count, progress bar
4. Add filters (All, Active, Completed)
5. Implement search functionality
6. Add "Add Project" FAB
7. Navigate to project detail on tap

**Acceptance Criteria:**
- [ ] All projects display in grid/list view
- [ ] Project cards show name, color, task count, progress
- [ ] Progress bar shows completion percentage
- [ ] Filters work (All, Active, Completed)
- [ ] Search filters by project name
- [ ] Tapping project navigates to detail screen
- [ ] FAB opens add project screen

**Dependencies:** Sprint 2
**Risk:** Low

**Files to Create:**
- `src/screens/projects/ProjectsScreen.tsx`
- `src/components/projects/ProjectCard.tsx`

**Technical Notes:**
- Backend endpoint: GET `/api/projects`
- Calculate progress: (completed_tasks / total_tasks) * 100

---

#### US-4.6: Project Detail & Kanban Board

**As a** user
**I want to** view project tasks in a Kanban board
**So that** I can visualize task workflow

**Story Points:** 8
**Estimated Hours:** 14h

**Technical Tasks:**
1. Create ProjectDetailScreen
2. Implement Kanban board with columns (To Do, In Progress, Done)
3. Add drag-and-drop between columns
4. Filter tasks by project_id
5. Update task status on column move
6. Add "Add Task" button per column
7. Implement horizontal scroll for columns

**Acceptance Criteria:**
- [ ] Kanban board displays with 3 columns
- [ ] Tasks grouped by status in correct columns
- [ ] Drag-and-drop moves tasks between columns
- [ ] Moving task updates status (1→2→6)
- [ ] "Add Task" creates task in selected column
- [ ] Columns scroll horizontally on small screens
- [ ] Animations are smooth (60fps)

**Dependencies:** US-4.5, Sprint 2
**Risk:** High - Drag-and-drop can be complex

**Files to Create:**
- `src/screens/projects/ProjectDetailScreen.tsx`
- `src/components/projects/KanbanBoard.tsx`
- `src/components/projects/KanbanColumn.tsx`

**Technical Notes:**
- Use react-native-draggable-flatlist or @dnd-kit
- Status mapping: 1=To Do, 2=In Progress, 6=Done
- Optimize rendering with React.memo

---

### Sprint 4 Testing Requirements

**Unit Tests:**
- [ ] SQLite CRUD operations
- [ ] Sync queue logic
- [ ] Conflict resolution
- [ ] Network status detection

**Integration Tests:**
- [ ] Offline task creation → Online sync
- [ ] Offline transaction → Online sync
- [ ] Sync conflict resolution

**Manual Testing:**
- [ ] Test offline mode (airplane mode)
- [ ] Test sync after going online
- [ ] Test with sync conflicts (edit on web + mobile)
- [ ] Test Kanban drag-and-drop

**Estimated Testing Hours:** 12h

---

### Sprint 4 Summary

**Deliverables:**
- ✅ SQLite database with local storage
- ✅ Offline sync queue with automatic sync
- ✅ Offline mode for tasks and transactions
- ✅ Projects list and detail screens
- ✅ Kanban board with drag-and-drop

---

## SPRINT 5: BIOMETRICS, NOTIFICATIONS & POLISH (Weeks 9-10)

**Goal:** Add biometric auth, push notifications, and polish the UI/UX

**Story Points:** 38
**Estimated Hours:** 72h
**Team Capacity:** 80h
**Buffer:** 8h

### User Stories

#### US-5.1: Biometric Authentication

**As a** user
**I want to** login with Face ID or Fingerprint
**So that** I can access the app securely and quickly

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Install expo-local-authentication
2. Check biometric availability on device
3. Add biometric login option in settings
4. Implement biometric prompt on app launch
5. Fallback to password if biometrics fail
6. Save biometric preference to AsyncStorage
7. Add biometric re-authentication for sensitive actions

**Acceptance Criteria:**
- [ ] App detects if biometrics are available (Face ID, Touch ID, Fingerprint)
- [ ] User can enable biometric login in settings
- [ ] On app launch, biometric prompt appears if enabled
- [ ] Successful biometric login retrieves JWT from SecureStore
- [ ] Failed biometric login (3 attempts) falls back to password
- [ ] Sensitive actions (delete all data) require biometric re-auth
- [ ] Works on both iOS and Android

**Dependencies:** Sprint 1 (Auth)
**Risk:** Medium - Platform-specific behavior

**Files to Create:**
- `src/hooks/useBiometrics.ts`
- `src/screens/settings/SecuritySettingsScreen.tsx`

**Technical Notes:**
- iOS: Face ID, Touch ID
- Android: Fingerprint, Face Unlock
- Use expo-local-authentication.authenticateAsync()
- Store JWT in expo-secure-store with biometric protection

---

#### US-5.2: Push Notifications Setup

**As a** developer
**I want to** set up push notifications
**So that** users can receive task reminders and alerts

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Install expo-notifications
2. Request notification permissions
3. Get push notification token
4. Send token to backend (for remote notifications - future)
5. Create local notification scheduler
6. Implement notification handlers (foreground, background)
7. Add notification tap navigation
8. Create notification settings screen

**Acceptance Criteria:**
- [ ] App requests notification permission on first launch
- [ ] Push token is generated and logged
- [ ] Local notifications can be scheduled
- [ ] Tapping notification navigates to relevant screen
- [ ] Foreground notifications display with banner
- [ ] Background notifications appear in notification center
- [ ] User can enable/disable notifications in settings

**Dependencies:** None
**Risk:** Medium - Platform-specific setup

**Files to Create:**
- `src/services/notificationService.ts`
- `src/screens/settings/NotificationSettingsScreen.tsx`

**Technical Notes:**
- iOS: Requires APNs certificate (future for remote)
- Android: Requires Firebase Cloud Messaging (future for remote)
- MVP: Local notifications only (task reminders)

---

#### US-5.3: Task Reminders (Local Notifications)

**As a** user
**I want to** receive notifications for task due dates
**So that** I don't miss deadlines

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Schedule notification when task is created with due date
2. Cancel notification when task is completed
3. Reschedule notification when due date is updated
4. Send notification 1 hour before due time
5. Add "Remind me" option in task creation
6. Allow custom reminder times (1h, 3h, 1 day before)

**Acceptance Criteria:**
- [ ] Notification scheduled when task has due date
- [ ] Notification shows 1 hour before due time
- [ ] Notification includes task title and priority
- [ ] Tapping notification opens task detail
- [ ] Completing task cancels notification
- [ ] Editing due date reschedules notification
- [ ] User can customize reminder time

**Dependencies:** US-5.2
**Risk:** Low

**Files to Modify:**
- `src/store/slices/tasksSlice.ts`
- `src/screens/tasks/AddTaskScreen.tsx`

**Technical Notes:**
- Use expo-notifications.scheduleNotificationAsync()
- Store notification ID in task record (for cancellation)

---

#### US-5.4: Dark Mode

**As a** user
**I want to** switch between light and dark themes
**So that** the app is comfortable to use in different lighting

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Define dark color palette
2. Create theme context or Redux slice
3. Implement theme toggle in settings
4. Apply theme to all components
5. Save theme preference to AsyncStorage
6. Add "Auto" option (follow system theme)
7. Test all screens in dark mode

**Acceptance Criteria:**
- [ ] Dark mode toggle available in settings
- [ ] All screens support dark mode
- [ ] Color contrast meets accessibility standards (4.5:1)
- [ ] Theme preference persists across app restarts
- [ ] "Auto" option follows system theme
- [ ] Transition between themes is smooth
- [ ] Charts and images adapt to dark mode

**Dependencies:** None
**Risk:** Low - but requires thorough testing

**Files to Create:**
- `src/theme/colors.ts`
- `src/theme/ThemeProvider.tsx`
- `src/screens/settings/AppearanceSettingsScreen.tsx`

**Technical Notes:**
- Light mode: Background #FFFFFF, Text #1F2937
- Dark mode: Background #121212, Text #F9FAFB
- Use React Context or Redux for theme state

---

#### US-5.5: Home Screen Widget (Basic)

**As a** user
**I want to** see my balance and task count on the home screen
**So that** I can glance at my status without opening the app

**Story Points:** 5
**Estimated Hours:** 10h

**Technical Tasks:**
1. Create iOS widget (WidgetKit with SwiftUI)
2. Create Android widget (Jetpack Glance or XML)
3. Widget displays balance and task count
4. Widget refreshes every 15 minutes
5. Tapping widget opens app to Dashboard
6. Read data from shared SQLite database (iOS) or ContentProvider (Android)

**Acceptance Criteria:**
- [ ] iOS widget displays on home screen
- [ ] Android widget displays on home screen
- [ ] Widget shows balance and task count
- [ ] Widget refreshes periodically (15 min)
- [ ] Tapping widget opens app
- [ ] Widget updates after app changes data

**Dependencies:** Sprint 3 (Finance), Sprint 4 (SQLite)
**Risk:** High - Requires native code (Swift/Kotlin)

**Files to Create:**
- `ios/FintraxWidget/` (Swift files)
- `android/app/src/main/java/com/fintrax/widget/` (Kotlin/Java files)

**Technical Notes:**
- iOS: Use WidgetKit with App Groups for shared data
- Android: Use AppWidgetProvider and Room database
- May need to create native modules in React Native

---

#### US-5.6: Pull-to-Refresh & Loading States

**As a** user
**I want to** pull screens to refresh data
**So that** I can manually sync with the server

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Add RefreshControl to all list screens
2. Implement refresh handlers (fetch from API)
3. Create loading skeleton components
4. Show loading skeletons during initial data fetch
5. Add loading spinners for actions (save, delete)
6. Ensure consistent loading UX across app

**Acceptance Criteria:**
- [ ] Pull-to-refresh works on all list screens
- [ ] Refreshing fetches latest data from API
- [ ] Loading skeletons display during initial load
- [ ] Action buttons show loading spinners
- [ ] No blank screens during loading
- [ ] Refresh animation is smooth

**Dependencies:** None
**Risk:** Low

**Files to Create:**
- `src/components/common/LoadingSkeleton.tsx`
- `src/components/common/LoadingSpinner.tsx`

**Technical Notes:**
- Use React Native RefreshControl
- Skeleton libraries: react-native-skeleton-placeholder

---

#### US-5.7: UI Polish & Animations

**As a** user
**I want to** smooth animations and polished UI
**So that** the app feels professional and delightful

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Add haptic feedback to buttons and swipe actions
2. Improve screen transitions (fade, slide)
3. Add micro-animations (button press, card tap)
4. Ensure 60fps animations with Reanimated
5. Polish empty states with illustrations
6. Add toast notifications for success/error
7. Improve form focus states

**Acceptance Criteria:**
- [ ] Haptic feedback on button presses
- [ ] Screen transitions are smooth
- [ ] Animations run at 60fps
- [ ] Empty states have friendly illustrations/messages
- [ ] Toast notifications show for important actions
- [ ] Forms have clear focus indicators
- [ ] Overall feel is polished and professional

**Dependencies:** None
**Risk:** Low

**Files to Modify:**
- Various components (add haptics and animations)

**Technical Notes:**
- Use expo-haptics for vibrations
- Use react-native-reanimated for animations
- Consider Lottie for complex animations

---

#### US-5.8: Settings & Profile Screen

**As a** user
**I want to** manage my profile and app settings
**So that** I can customize the app to my preferences

**Story Points:** 2
**Estimated Hours:** 4h

**Technical Tasks:**
1. Create MoreScreen with sections
2. Add profile section (name, email, avatar placeholder)
3. Add settings navigation (Security, Notifications, Appearance, Backup)
4. Implement logout functionality
5. Add about section (version, privacy policy, terms)

**Acceptance Criteria:**
- [ ] More screen displays user profile info
- [ ] Settings sections navigate to correct screens
- [ ] Logout clears token and returns to login
- [ ] About section shows app version
- [ ] Links to privacy policy and terms work

**Dependencies:** None
**Risk:** Low

**Files to Create:**
- `src/screens/more/MoreScreen.tsx`
- `src/screens/settings/SettingsScreen.tsx`
- `src/screens/settings/AboutScreen.tsx`

---

### Sprint 5 Testing Requirements

**Unit Tests:**
- [ ] Biometric authentication logic
- [ ] Notification scheduling
- [ ] Theme switching

**Integration Tests:**
- [ ] Biometric login flow
- [ ] Task reminder notifications
- [ ] Dark mode persistence

**Manual Testing:**
- [ ] Test biometrics on iOS (Face ID, Touch ID)
- [ ] Test biometrics on Android (Fingerprint)
- [ ] Test notifications (foreground, background)
- [ ] Test dark mode on all screens
- [ ] Test widgets on iOS and Android

**Estimated Testing Hours:** 10h

---

### Sprint 5 Summary

**Deliverables:**
- ✅ Biometric authentication (Face ID, Touch ID, Fingerprint)
- ✅ Push notification setup
- ✅ Task reminder notifications
- ✅ Dark mode with auto-detection
- ✅ Home screen widget (basic)
- ✅ Pull-to-refresh and loading states
- ✅ UI polish and animations
- ✅ Settings and profile screen

---

## SPRINT 6: TESTING, BETA LAUNCH & APP STORE SUBMISSION (Weeks 11-12)

**Goal:** Comprehensive testing, bug fixes, beta testing, and App Store/Play Store submission

**Story Points:** 40
**Estimated Hours:** 80h
**Team Capacity:** 80h
**Buffer:** 0h (all hands on deck)

### User Stories

#### US-6.1: Comprehensive Testing

**As a** QA tester
**I want to** test all app features thoroughly
**So that** we can identify and fix bugs before launch

**Story Points:** 13
**Estimated Hours:** 20h

**Technical Tasks:**
1. Create test plan document
2. Perform unit testing (80% coverage target)
3. Perform integration testing
4. Perform E2E testing with Detox
5. Cross-browser testing (iOS 15-17, Android 8-14)
6. Test on different screen sizes (iPhone SE, Pro Max, tablets)
7. Accessibility testing (VoiceOver, TalkBack)
8. Performance testing (launch time, memory, battery)
9. Security testing (token storage, API security)
10. Offline testing (airplane mode)

**Acceptance Criteria:**
- [ ] Unit test coverage > 80%
- [ ] All integration tests pass
- [ ] E2E tests cover critical flows
- [ ] App works on iOS 15+ and Android 8+
- [ ] App works on phones and tablets
- [ ] VoiceOver and TalkBack navigation works
- [ ] Launch time < 2 seconds
- [ ] No memory leaks detected
- [ ] JWT tokens stored securely
- [ ] Offline mode works correctly

**Dependencies:** All previous sprints
**Risk:** High - May discover critical bugs

**Test Scenarios:**
1. **Authentication:** Register, login, OTP, forgot password, biometric login
2. **Tasks:** Create, edit, delete, filter, swipe actions, Kanban drag-drop
3. **Finance:** Add transaction, view charts, filter transactions
4. **Projects:** Create project, Kanban board, add tasks to project
5. **Offline:** Create task offline, go online, verify sync
6. **Notifications:** Schedule reminder, receive notification, tap to open
7. **Settings:** Change theme, enable biometrics, logout

---

#### US-6.2: Bug Fixing & Stabilization

**As a** developer
**I want to** fix all critical and high-priority bugs
**So that** the app is stable for beta users

**Story Points:** 13
**Estimated Hours:** 20h

**Technical Tasks:**
1. Create bug tracking board (GitHub Issues, Jira)
2. Prioritize bugs (P0, P1, P2, P3)
3. Fix all P0 (blocking) bugs
4. Fix critical P1 bugs
5. Document known issues (P2, P3)
6. Create regression test suite

**Acceptance Criteria:**
- [ ] All P0 bugs fixed and verified
- [ ] 90% of P1 bugs fixed
- [ ] Known issues documented
- [ ] Regression tests prevent repeat bugs
- [ ] QA sign-off on critical flows
- [ ] No data loss bugs
- [ ] No security vulnerabilities

**Dependencies:** US-6.1
**Risk:** High - Unknown bug count

**Bug Categories:**
- **Crashes:** App crashes, ANR (Android Not Responding)
- **Data Loss:** Offline sync issues, data corruption
- **UI Bugs:** Layout issues, broken animations
- **Performance:** Slow screens, high memory usage
- **Security:** Token exposure, insecure storage

---

#### US-6.3: App Store Assets & Metadata

**As a** product manager
**I want to** prepare App Store and Play Store listings
**So that** users can discover and download the app

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Design app icon (1024x1024 for iOS, adaptive for Android)
2. Create splash screen (iOS: LaunchScreen, Android: Splash API)
3. Capture screenshots (iPhone 5.5", 6.5", iPad 12.9", Android phones/tablets)
4. Write app description (short and long)
5. Add keywords for SEO (iOS: 100 chars, Android: tags)
6. Create promotional graphics (Play Store feature graphic)
7. Write privacy policy and terms of service
8. Prepare what's new / release notes

**Acceptance Criteria:**
- [ ] App icon designed for all required sizes
- [ ] Splash screen implemented for iOS and Android
- [ ] Screenshots captured for all required sizes
- [ ] App description is compelling and clear
- [ ] Keywords optimized for search
- [ ] Privacy policy URL is valid
- [ ] Terms of service URL is valid
- [ ] Release notes written

**Dependencies:** None
**Risk:** Low

**Required Screenshots:**
- iOS: 6.5" (iPhone 13 Pro Max), 5.5" (iPhone 8 Plus), 12.9" (iPad Pro)
- Android: Phone (1080x1920), 7" tablet, 10" tablet

**App Description:**
- Short: 80 characters (elevator pitch)
- Long: 4000 characters (features, benefits, how it works)

---

#### US-6.4: Beta Testing Setup

**As a** product manager
**I want to** distribute the app to beta testers
**So that** we can gather feedback before public launch

**Story Points:** 5
**Estimated Hours:** 8h

**Technical Tasks:**
1. Set up TestFlight for iOS
2. Set up Google Play Internal Testing for Android
3. Invite beta testers (50-100 users)
4. Create beta testing guide/instructions
5. Set up feedback collection (in-app form, email)
6. Configure crash reporting (Sentry)
7. Set up analytics (Firebase Analytics)
8. Monitor beta metrics

**Acceptance Criteria:**
- [ ] iOS app uploaded to TestFlight
- [ ] Android app uploaded to Play Console Internal Testing
- [ ] 50+ beta testers invited
- [ ] Beta testing guide sent to testers
- [ ] In-app feedback form works
- [ ] Crash reports visible in Sentry
- [ ] Analytics tracking key events
- [ ] Beta metrics monitored daily

**Dependencies:** US-6.2
**Risk:** Medium - Requires Apple/Google account setup

**Beta Metrics:**
- Crash-free rate > 99%
- Average session duration > 3 minutes
- Daily active users > 40% of beta users
- Feature usage (task creation, transaction logging)

---

#### US-6.5: Beta Feedback & Iteration

**As a** product team
**I want to** collect and implement beta feedback
**So that** the app meets user expectations

**Story Points:** 8
**Estimated Hours:** 12h

**Technical Tasks:**
1. Monitor beta feedback channels (email, in-app, TestFlight reviews)
2. Categorize feedback (bugs, feature requests, UX improvements)
3. Prioritize top 5-10 issues
4. Implement critical bug fixes
5. Implement high-impact UX improvements
6. Update beta build and notify testers
7. Conduct second round of testing

**Acceptance Criteria:**
- [ ] All beta feedback reviewed and categorized
- [ ] Top 5 critical issues fixed
- [ ] Top 3 UX improvements implemented
- [ ] Updated build distributed to testers
- [ ] Second round of feedback collected
- [ ] Crash-free rate improved to 99%+

**Dependencies:** US-6.4
**Risk:** Medium - Scope may vary based on feedback

**Common Beta Feedback:**
- Onboarding confusion
- Missing features
- Performance issues
- UI/UX improvements
- Bug reports

---

#### US-6.6: App Store Submission (iOS)

**As a** developer
**I want to** submit the app to the Apple App Store
**So that** iOS users can download it

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Create App Store Connect app listing
2. Build production release (Archive in Xcode)
3. Upload build to App Store Connect (via Xcode or Transporter)
4. Fill in app metadata (description, keywords, screenshots)
5. Set pricing and availability
6. Complete App Privacy questionnaire
7. Complete age rating questionnaire
8. Submit for review

**Acceptance Criteria:**
- [ ] App listed in App Store Connect
- [ ] Production build uploaded
- [ ] All metadata fields complete
- [ ] Screenshots uploaded for all sizes
- [ ] Privacy policy and terms links valid
- [ ] App submitted for review
- [ ] Submission confirmation received

**Dependencies:** US-6.3, US-6.5
**Risk:** Medium - Apple review can reject

**Review Time:** Typically 1-3 days

**Common Rejection Reasons:**
- Incomplete metadata
- Privacy policy missing
- Crashes during review
- Guideline violations

---

#### US-6.7: Play Store Submission (Android)

**As a** developer
**I want to** submit the app to Google Play Store
**So that** Android users can download it

**Story Points:** 3
**Estimated Hours:** 6h

**Technical Tasks:**
1. Create Google Play Console app listing
2. Build production release (.aab bundle)
3. Upload bundle to Play Console
4. Fill in app metadata (description, screenshots)
5. Set pricing and distribution
6. Complete content rating questionnaire
7. Review and publish

**Acceptance Criteria:**
- [ ] App listed in Play Console
- [ ] Production bundle uploaded
- [ ] All metadata fields complete
- [ ] Screenshots uploaded for phones and tablets
- [ ] Privacy policy and terms links valid
- [ ] Content rating completed
- [ ] App published to production track

**Dependencies:** US-6.3, US-6.5
**Risk:** Low - Google review is faster

**Review Time:** Typically few hours to 1 day

**Required:**
- App bundle (.aab) signed with release keystore
- Minimum SDK: Android 8.0 (API 26)

---

### Sprint 6 Testing Requirements

**Final QA:**
- [ ] Full regression testing
- [ ] Cross-platform testing (iOS + Android)
- [ ] Different device testing (phones, tablets)
- [ ] Accessibility retest
- [ ] Performance testing (Lighthouse, profiling)
- [ ] Security testing (penetration testing - basic)

**Production Smoke Tests:**
- [ ] Login flow
- [ ] Create task
- [ ] Add transaction
- [ ] Dashboard loads
- [ ] Offline sync works
- [ ] Notifications work

**Estimated Testing Hours:** 12h

---

### Sprint 6 Summary

**Deliverables:**
- ✅ Comprehensive testing (unit, integration, E2E)
- ✅ All critical bugs fixed
- ✅ App Store and Play Store assets ready
- ✅ Beta testing with 50+ users
- ✅ Beta feedback implemented
- ✅ iOS app submitted to App Store
- ✅ Android app submitted to Play Store
- ✅ App ready for public launch

---

## RISK MITIGATION STRATEGIES

### High-Risk Items

1. **Offline Sync (US-4.2) - 13 points**
   - **Risk:** Complex conflict resolution, data loss
   - **Mitigation:**
     - Start with simple last-write-wins strategy
     - Extensive testing with airplane mode
     - Add manual conflict resolution UI if needed
   - **Fallback:** Simplify to online-only mode for MVP
   - **Time buffer:** +8h

2. **Kanban Drag-Drop (US-4.6) - 8 points**
   - **Risk:** Performance issues, gesture conflicts
   - **Mitigation:**
     - Use well-tested library (react-native-draggable-flatlist)
     - Optimize with React.memo and useMemo
     - Test on low-end devices
   - **Fallback:** Use tap to move between columns
   - **Time buffer:** +6h

3. **Home Screen Widget (US-5.5) - 5 points**
   - **Risk:** Requires native code (Swift/Kotlin)
   - **Mitigation:**
     - Allocate time for native module learning
     - Use Expo config plugins if available
     - Follow platform-specific tutorials
   - **Fallback:** Defer to post-MVP
   - **Time buffer:** +4h

4. **Beta Testing (US-6.4, 6.5) - 13 points**
   - **Risk:** Unknown bugs, negative feedback
   - **Mitigation:**
     - Recruit diverse testers (iOS, Android, different devices)
     - Set clear expectations (beta = bugs expected)
     - Prioritize feedback ruthlessly
   - **Contingency:** Extend beta by 1 week if critical issues found
   - **Time buffer:** +8h

5. **App Store Rejection (US-6.6, 6.7)**
   - **Risk:** Rejection delays launch
   - **Mitigation:**
     - Follow guidelines strictly
     - Test app thoroughly before submission
     - Prepare detailed privacy policy
   - **Contingency:** Fix issues and resubmit within 48h
   - **Time buffer:** +4h (for resubmission)

---

## DEFINITION OF DONE

### For Each User Story

- [ ] Code written and peer reviewed
- [ ] Unit tests written and passing (where applicable)
- [ ] Manual testing completed on iOS and Android
- [ ] Responsive design verified (phones and tablets)
- [ ] Accessibility checked (VoiceOver/TalkBack)
- [ ] No console errors or warnings
- [ ] Code follows ESLint/Prettier rules
- [ ] Product owner approval

### For Each Sprint

- [ ] All committed stories complete
- [ ] Test coverage maintained/improved
- [ ] No P0 or P1 bugs open
- [ ] Demo conducted with stakeholders
- [ ] Retrospective completed
- [ ] Next sprint planned

### For MVP Launch

- [ ] All 6 sprints complete
- [ ] All P0 and P1 bugs fixed
- [ ] Core features working end-to-end
- [ ] Performance targets met (launch < 2s, 60fps animations)
- [ ] Security audit passed
- [ ] Accessibility standards met (WCAG AA)
- [ ] Beta testing completed with positive feedback
- [ ] App Store and Play Store approved
- [ ] Crash-free rate > 99%

---

## SUCCESS METRICS

### Technical Metrics

- ✅ App size < 50 MB
- ✅ Launch time < 2 seconds (cold start)
- ✅ 60 FPS animations (no frame drops)
- ✅ Crash-free rate > 99%
- ✅ API response time < 500ms (p95)
- ✅ Offline sync success rate > 95%
- ✅ Test coverage > 80%

### User Metrics

- ✅ 1,000+ downloads in first month
- ✅ 4.0+ star rating (App Store + Play Store)
- ✅ 60%+ user retention (7-day)
- ✅ 40%+ user activation (complete onboarding + create first task)
- ✅ Average session duration > 3 minutes
- ✅ Daily active users > 30% of total users

### Business Metrics

- ✅ MVP launched on time (12 weeks)
- ✅ Budget within estimate
- ✅ Positive user feedback (NPS > 8)
- ✅ No critical incidents (data loss, security breach)
- ✅ Foundation ready for future features (Phase 2)

---

## SPRINT CAPACITY SUMMARY

| Sprint | Story Points | Est. Hours | Capacity | Status |
|--------|--------------|------------|----------|--------|
| Sprint 1 | 38 | 76h | 80h | ✅ Under capacity |
| Sprint 2 | 42 | 80h | 80h | ⚠️ At capacity |
| Sprint 3 | 40 | 76h | 80h | ✅ Under capacity |
| Sprint 4 | 42 | 80h | 80h | ⚠️ At capacity |
| Sprint 5 | 38 | 72h | 80h | ✅ Under capacity |
| Sprint 6 | 40 | 80h | 80h | ⚠️ At capacity |
| **Total** | **240** | **464h** | **480h** | **✅ Within capacity** |

**Notes:**
- Sprints 2, 4, 6 are at capacity - prioritize ruthlessly
- Built-in buffer in Sprints 1, 3, 5 (16h total)
- High-risk items have additional time buffers allocated
- Defer non-critical features to post-MVP if needed

---

## POST-MVP ROADMAP (Phase 2 - Months 4-6)

**Priority Features:**
1. Receipt scanning (OCR) for transactions
2. Voice task creation (Siri Shortcuts, Google Assistant)
3. Calendar integration (sync tasks with device calendar)
4. Advanced charts & analytics
5. Budgeting features
6. Recurring transactions
7. Export to PDF/CSV
8. Multi-currency support
9. iPad/tablet optimization (split-view)
10. Wear OS / Apple Watch companion app

**Technical Debt:**
- Improve test coverage to 90%
- Optimize bundle size further
- Implement CI/CD pipeline (GitHub Actions)
- Add comprehensive E2E test suite
- Set up monitoring and crash reporting

---

## APPENDIX: COMMUNICATION PLAN

### Daily
- Stand-up meetings (15 min) - 9 AM
- Slack/Discord updates
- PR reviews (within 4 hours)

### Weekly
- Sprint planning (start of sprint, 2h)
- Sprint review/demo (end of sprint, 1h)
- Sprint retrospective (end of sprint, 1h)
- Stakeholder updates (Friday, 30 min)

### As Needed
- Technical design reviews
- Pair programming sessions
- Bug triage meetings
- User feedback review

---

## APPENDIX: TOOLS & INFRASTRUCTURE

**Development:**
- React Native 0.73+ with Expo 50+
- Visual Studio Code with extensions (ESLint, Prettier, React Native Tools)
- Xcode (iOS) and Android Studio (Android)
- Git + GitHub for version control

**Testing:**
- Jest for unit/integration tests
- Detox for E2E tests
- Reactotron for debugging
- Flipper for React Native debugging

**Deployment:**
- Expo EAS Build for building apps
- TestFlight for iOS beta
- Google Play Internal Testing for Android beta
- Sentry for crash reporting
- Firebase Analytics for usage analytics

**Design:**
- Figma for UI/UX mockups (recommended)
- Sketch or Adobe XD (alternative)

---

**Document Version:** 1.0
**Last Updated:** November 14, 2025
**Created By:** Product Management & Engineering Team
**Status:** Ready for Execution

---

**End of Mobile Sprint Plan**

**Next Steps:**
1. Review and approve sprint plan
2. Set up development environment (Sprint 1, Week 1)
3. Create project in Expo (Sprint 1, Day 1)
4. Begin Sprint 1 development
5. Schedule daily stand-ups and weekly reviews
