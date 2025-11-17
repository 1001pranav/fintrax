# Sprint 2 Quick Reference Guide
## Core Navigation & Task Management

**Status:** 📝 Ready for Development | **Duration:** 2 weeks | **Story Points:** 42

---

## 🎯 Sprint Goals

Build the core task management system with:
- ✅ Bottom tab navigation
- ✅ Dashboard with overview widgets
- ✅ Complete CRUD for tasks
- ✅ Filters, search, and sorting
- ✅ Swipe gestures
- ✅ API integration with offline support

---

## 📋 User Stories Checklist

### US-2.1: Bottom Tab Navigation (5 pts, 8h) ✅ DONE
- [x] Tab bar with 5 tabs (Dashboard, Tasks, Finance, Projects, More)
- [x] Icons and labels configured
- [ ] Stack navigators for each tab
- [ ] Deep linking setup (optional)

**Files:**
- `src/navigation/MainNavigator.tsx` (already exists)
- `src/navigation/TasksNavigator.tsx` (create stack navigator)

---

### US-2.2: Dashboard Screen UI (8 pts, 12h)
- [ ] Welcome header with time-based greeting
- [ ] Financial summary card (balance, net worth)
- [ ] Quick action buttons
- [ ] Recent tasks widget (top 5)
- [ ] Recent transactions widget (top 5)
- [ ] Pull-to-refresh

**Components to Create:**
```
src/screens/dashboard/
  ├── DashboardScreen.tsx
src/components/dashboard/
  ├── WelcomeHeader.tsx
  ├── FinancialSummaryCard.tsx
  ├── QuickActions.tsx
  ├── RecentTasksWidget.tsx
  └── RecentTransactionsWidget.tsx
```

**Redux:**
- Create `dashboardSlice.ts` with `fetchDashboardData()` thunk

**API:**
- `GET /api/dashboard` - Returns aggregated dashboard data

---

### US-2.3: Task List Screen (8 pts, 12h)
- [ ] FlatList with task cards
- [ ] Priority grouping (High, Medium, Low)
- [ ] Search bar
- [ ] Filters (status, priority, project)
- [ ] Empty state
- [ ] FAB for adding tasks

**Components to Create:**
```
src/screens/tasks/
  ├── TaskListScreen.tsx
src/components/tasks/
  ├── TaskCard.tsx
  ├── TaskFilters.tsx
src/components/common/
  ├── SearchBar.tsx
  └── EmptyState.tsx
```

**Performance:**
- Use `FlatList` with `getItemLayout` for fixed heights
- Apply `React.memo` to TaskCard
- Limit rendered items with `windowSize={5}`

---

### US-2.4: Create Task Flow (8 pts, 12h)
- [ ] Add Task screen (modal or full screen)
- [ ] Form fields (title, description, priority, due date, project)
- [ ] Date picker for due date
- [ ] Project selector dropdown
- [ ] Priority selector (1-5)
- [ ] Form validation
- [ ] Success toast

**Components to Create:**
```
src/screens/tasks/
  ├── AddTaskScreen.tsx
src/components/common/
  ├── DatePicker.tsx
  ├── PrioritySelector.tsx
  └── ProjectSelector.tsx
```

**Redux:**
- `createTask()` thunk in `tasksSlice.ts`
- Optimistic UI update (add to local state immediately)
- Sync to backend in background

**API:**
- `POST /api/todo` - Create task
- Request body: `{ title, description, priority, due_days, start_date, end_date, project_id }`

---

### US-2.5: Task Detail & Edit (5 pts, 10h)
- [ ] Task detail screen (read-only initially)
- [ ] Edit mode toggle
- [ ] Update all fields
- [ ] Delete task functionality
- [ ] Confirmation dialog for delete
- [ ] Soft delete (status = 5)

**Components to Create:**
```
src/screens/tasks/
  └── TaskDetailScreen.tsx
```

**Redux:**
- `updateTask()` thunk
- `deleteTask()` thunk (soft delete)

**API:**
- `GET /api/todo/:id` - Get task details
- `PATCH /api/todo/:id` - Update task
- `DELETE /api/todo/:id` - Soft delete task (status = 5)

---

### US-2.6: Tasks API Integration & Redux (5 pts, 10h)
- [ ] Create `tasksSlice.ts` in Redux
- [ ] Implement async thunks (getAll, create, update, delete)
- [ ] Loading and error states
- [ ] Optimistic updates
- [ ] Success/error toast notifications

**Redux Slice Structure:**
```typescript
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
}

// Thunks:
- fetchTasks()
- createTask(task)
- updateTask(id, updates)
- deleteTask(id)
```

**API Client:**
- Create `src/api/tasks.api.ts` with all task endpoints
- Use axios interceptors for auth token
- Handle 401 errors (redirect to login)

---

### US-2.7: Task Swipe Gestures (3 pts, 6h)
- [ ] Swipe right → Mark complete (green background)
- [ ] Swipe left → Delete (red background, confirmation)
- [ ] Haptic feedback on action
- [ ] Smooth animations (60fps)

**Libraries:**
- `react-native-gesture-handler` (Swipeable component)
- `expo-haptics` (vibration feedback)

**Implementation:**
```typescript
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const renderRightActions = () => (
  <View style={{ backgroundColor: '#10B981' }}>
    <Ionicons name="checkmark" size={24} color="#FFF" />
  </View>
);

const renderLeftActions = () => (
  <View style={{ backgroundColor: '#EF4444' }}>
    <Ionicons name="trash" size={24} color="#FFF" />
  </View>
);

<Swipeable
  renderRightActions={renderRightActions}
  renderLeftActions={renderLeftActions}
  onSwipeableRightOpen={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleComplete();
  }}
  onSwipeableLeftOpen={() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    handleDelete();
  }}
>
  <TaskCard task={task} />
</Swipeable>
```

---

## 🗂️ File Structure

```
mobile/src/
├── screens/
│   ├── dashboard/
│   │   └── DashboardScreen.tsx          [US-2.2]
│   └── tasks/
│       ├── TaskListScreen.tsx           [US-2.3]
│       ├── AddTaskScreen.tsx            [US-2.4]
│       └── TaskDetailScreen.tsx         [US-2.5]
│
├── components/
│   ├── dashboard/
│   │   ├── WelcomeHeader.tsx
│   │   ├── FinancialSummaryCard.tsx
│   │   ├── QuickActions.tsx
│   │   ├── RecentTasksWidget.tsx
│   │   └── RecentTransactionsWidget.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx                 [US-2.3, US-2.7]
│   │   └── TaskFilters.tsx              [US-2.3]
│   └── common/
│       ├── SearchBar.tsx
│       ├── EmptyState.tsx
│       ├── DatePicker.tsx
│       ├── PrioritySelector.tsx
│       └── ProjectSelector.tsx
│
├── navigation/
│   ├── MainNavigator.tsx                [US-2.1] ✅
│   └── TasksNavigator.tsx               [US-2.1] NEW
│
├── store/slices/
│   ├── dashboardSlice.ts                [US-2.2]
│   └── tasksSlice.ts                    [US-2.6]
│
├── api/
│   └── tasks.api.ts                     [US-2.6]
│
└── utils/
    └── dateUtils.ts                     [US-2.2]
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Used In |
|--------|----------|-------------|---------|
| GET | `/api/dashboard` | Get dashboard summary | US-2.2 |
| GET | `/api/todo` | Get all tasks | US-2.6 |
| POST | `/api/todo` | Create task | US-2.4 |
| GET | `/api/todo/:id` | Get task details | US-2.5 |
| PATCH | `/api/todo/:id` | Update task | US-2.5 |
| DELETE | `/api/todo/:id` | Soft delete task | US-2.5 |

**Backend Base URL:**
- Development: `http://localhost:80/api`
- Production: From env variable `REACT_APP_API_URL`

**Authentication:**
- All endpoints require JWT token in header: `Authorization: Bearer {token}`

---

## 📦 Redux State Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
  },
  dashboard: {
    balance: number,
    netWorth: number,
    recentTasks: Task[],
    recentTransactions: Transaction[],
    loading: boolean,
    error: string | null,
  },
  tasks: {
    tasks: Task[],
    selectedTask: Task | null,
    loading: boolean,
    error: string | null,
  },
  ui: {
    toast: { message: string, type: 'success' | 'error' } | null,
  },
}
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] `dateUtils.test.ts` - getGreeting(), formatDate()
- [ ] `tasksSlice.test.ts` - All reducers and thunks
- [ ] `TaskCard.test.tsx` - Component rendering
- [ ] `TaskFilters.test.tsx` - Filter logic

### Integration Tests
- [ ] Create task flow (UI → API → Redux → List update)
- [ ] Edit task flow
- [ ] Delete task flow
- [ ] Task filters

### Manual Testing (iOS & Android)
- [ ] Test on iPhone 13/15 (iOS Simulator)
- [ ] Test on Android Emulator (API 30, 34)
- [ ] Test swipe gestures (smooth animations)
- [ ] Test with 100+ tasks (performance)
- [ ] Test pull-to-refresh on all screens
- [ ] Test empty states
- [ ] Test error handling (network offline)

---

## ⚡ Performance Optimizations

### 1. FlatList Optimization
```typescript
<FlatList
  data={tasks}
  renderItem={renderTask}
  keyExtractor={(item) => item.id.toString()}
  getItemLayout={(data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  })}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  initialNumToRender={10}
/>
```

### 2. Component Memoization
```typescript
const TaskCard = React.memo(({ task, onPress }) => {
  const handlePress = useCallback(() => onPress(task.id), [task.id, onPress]);
  // ...
});
```

### 3. Optimistic Updates
```typescript
// Update UI immediately, sync to backend in background
const createTask = createAsyncThunk('tasks/create', async (task) => {
  const tempId = Date.now();
  const optimisticTask = { ...task, id: tempId, is_synced: false };

  // Add to local state immediately
  dispatch(addTaskOptimistic(optimisticTask));

  // Sync to backend
  const response = await api.createTask(task);
  return response.data;
});
```

---

## 🎨 UI/UX Guidelines

### Colors (Tailwind CSS)
- **Primary:** `#3B82F6` (blue-500)
- **Success:** `#10B981` (green-500)
- **Warning:** `#F59E0B` (amber-500)
- **Error:** `#EF4444` (red-500)
- **Background:** `#F9FAFB` (gray-50)
- **Text Primary:** `#1F2937` (gray-800)
- **Text Secondary:** `#6B7280` (gray-500)

### Priority Colors
- **High (1-2):** Red `#EF4444`
- **Medium (3-4):** Amber `#F59E0B`
- **Low (5):** Green `#10B981`

### Spacing
- **Padding:** 16px (standard screen padding)
- **Margin:** 8px (between cards)
- **Border Radius:** 8px (cards), 12px (larger cards)

### Touch Targets
- Minimum 44x44pt (iOS HIG, Android Material Design)
- FAB: 56x56px

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start Backend Server
```bash
cd ../backend
go run main.go  # Runs on http://localhost:80
```

### 3. Start Mobile App
```bash
cd ../mobile
npm start       # Opens Expo Dev Tools
npm run ios     # Run on iOS Simulator
npm run android # Run on Android Emulator
```

### 4. Development Workflow
1. Create feature branch: `git checkout -b feature/us-2-x-description`
2. Implement user story
3. Write unit tests
4. Test on iOS and Android
5. Create pull request
6. Code review
7. Merge to main

---

## 📝 Notes

- **Offline Support:** Tasks sync to SQLite first, then to backend when online (implement in Sprint 4)
- **Error Handling:** Show user-friendly toast messages for all errors
- **Loading States:** Always show loading indicators during async operations
- **Empty States:** Provide helpful messages and CTAs when lists are empty
- **Accessibility:** Ensure all interactive elements have proper labels for screen readers

---

## ❓ Common Issues & Solutions

### Issue: "Unable to connect to backend API"
**Solution:**
- For iOS Simulator: Use `http://localhost:80/api`
- For Android Emulator: Use `http://10.0.2.2:80/api`
- For Physical Devices: Use your computer's local IP (e.g., `http://192.168.1.100:80/api`)

### Issue: "Tasks not refreshing after create"
**Solution:**
- Ensure `fetchTasks()` is dispatched after successful create
- Check Redux DevTools to verify state update
- Verify API returns correct response format

### Issue: "Swipe gestures not working"
**Solution:**
- Ensure `react-native-gesture-handler` is properly installed
- Import `GestureHandlerRootView` in App.tsx
- Rebuild app after installing gesture handler

---

## 📚 Resources

- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Mobile Sprint Plan (Full)](./docs/MOBILE_SPRINT_PLAN.mobile.md)
- [Mobile App Design](./docs/MOBILE_APP_DESIGN.mobile.md)

---

**Document Version:** 1.0
**Last Updated:** November 17, 2025
**Status:** ✅ Ready for Development
