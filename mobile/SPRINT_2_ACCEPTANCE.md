# Sprint 2 Acceptance Criteria Checklist
## Core Navigation & Task Management

**Sprint Duration:** Weeks 3-4 | **Story Points:** 42

Use this checklist to verify all acceptance criteria are met before marking Sprint 2 as complete.

---

## ✅ US-2.1: Bottom Tab Navigation (5 pts)

### Functional Requirements
- [ ] Bottom tab bar displays on all main screens
- [ ] Tabs have icons and labels
- [ ] Active tab is visually highlighted
- [ ] Tapping tab navigates to correct screen
- [ ] Tab bar hides when keyboard is open
- [ ] Stack navigation works within each tab
- [ ] Back button navigation works correctly in stacks

### Visual Requirements
- [ ] Platform-specific styling applied (iOS vs Android)
- [ ] Tab icons are clear and recognizable
- [ ] Active tab color: `#3B82F6` (blue)
- [ ] Inactive tab color: `#9CA3AF` (gray)
- [ ] Tab labels are concise and descriptive

### Technical Requirements
- [ ] MainNavigator.tsx configured correctly
- [ ] TasksNavigator.tsx stack navigator created
- [ ] Navigation types defined in types.ts
- [ ] No console warnings about navigation

### Testing
- [ ] ✅ Tested on iOS simulator (iPhone 13, 15)
- [ ] ✅ Tested on Android emulator (API 30, 34)
- [ ] Tab navigation smooth with no lag
- [ ] Deep linking configured (optional for MVP)

---

## ✅ US-2.2: Dashboard Screen UI (8 pts)

### Header & Greeting
- [ ] Welcome header displays time-based greeting
  - [ ] "Good Morning" before 12 PM
  - [ ] "Good Afternoon" between 12 PM - 6 PM
  - [ ] "Good Evening" after 6 PM
- [ ] Current date displays in format "Thursday, Nov 14"
- [ ] Notification bell icon visible in header

### Financial Summary Card
- [ ] Balance card displays current balance
- [ ] Net worth displays correctly
- [ ] Both values formatted as currency (USD)
- [ ] Card has proper shadow/elevation
- [ ] Tapping card navigates to Finance tab

### Quick Actions
- [ ] Three action buttons visible (Add Task, Add Transaction, Add Project)
- [ ] Each button has correct icon
- [ ] Each button has correct color coding
- [ ] Tapping button navigates to correct screen
- [ ] Touch targets are at least 44x44pt

### Recent Tasks Widget
- [ ] Widget title shows "Today's Tasks (X)" with count
- [ ] Top 5 tasks display (or fewer if less available)
- [ ] Each task shows title, priority dot, due date
- [ ] Priority color-coding works (red/yellow/green)
- [ ] Tapping task navigates to TaskDetailScreen
- [ ] "View All" link navigates to Tasks tab
- [ ] Empty state shows when no tasks

### Recent Transactions Widget
- [ ] Widget title shows "Recent Transactions"
- [ ] Top 5 transactions display
- [ ] Each transaction shows icon, source, amount, time
- [ ] Income shows with green (+) color
- [ ] Expense shows with red (-) color
- [ ] Relative time displays correctly ("Today", "Yesterday", etc.)
- [ ] "View All" link navigates to Finance tab
- [ ] Empty state shows when no transactions

### Pull-to-Refresh
- [ ] Pull-to-refresh gesture works
- [ ] Loading indicator displays during refresh
- [ ] All widgets update after refresh
- [ ] Refresh fetches latest data from API

### Loading States
- [ ] Loading skeleton shows on initial load
- [ ] All widgets have loading states
- [ ] No blank screens during data fetch

### Error Handling
- [ ] Network errors show user-friendly message
- [ ] Retry option available on error
- [ ] App doesn't crash on API failure

### Testing
- [ ] ✅ Tested on iOS (iPhone 13, 15)
- [ ] ✅ Tested on Android (Pixel 5, Samsung)
- [ ] ✅ Pull-to-refresh tested
- [ ] ✅ Empty states verified
- [ ] ✅ Error states tested (airplane mode)

---

## ✅ US-2.3: Task List Screen (8 pts)

### Task Display
- [ ] All tasks display in scrollable list
- [ ] Tasks grouped by priority (High, Medium, Low)
- [ ] Section headers show priority label and count
- [ ] Each task card shows:
  - [ ] Title
  - [ ] Priority indicator (colored dot)
  - [ ] Due date (if set)
  - [ ] Project name (if assigned)
  - [ ] Checkbox for completion

### Search Functionality
- [ ] Search bar visible at top of screen
- [ ] Search filters tasks by title
- [ ] Search filters tasks by description
- [ ] Search is case-insensitive
- [ ] Search updates results in real-time
- [ ] Clear button (X) clears search

### Filters
- [ ] Filter bar displays below search
- [ ] Status filter works (All, To Do, In Progress, Done)
- [ ] Priority filter works (All, High, Medium, Low)
- [ ] Project filter works (All, Project 1, Project 2, etc.)
- [ ] Multiple filters can be applied simultaneously
- [ ] Filter count badge shows active filter count

### Swipe Actions (from US-2.7)
- [ ] Swipe right reveals complete action (green)
- [ ] Swipe left reveals delete action (red)
- [ ] Swipe threshold is appropriate (50% of card width)
- [ ] Actions trigger on full swipe
- [ ] Haptic feedback on action (iOS/Android)

### List Performance
- [ ] Smooth scrolling with 100+ tasks
- [ ] FlatList optimizations applied
- [ ] No frame drops (60 FPS maintained)
- [ ] Images/icons load efficiently

### Empty State
- [ ] Empty state displays when no tasks
- [ ] Icon shows (checkmark-done)
- [ ] Message: "No tasks found"
- [ ] Different message for search ("Try a different search term")
- [ ] "Create Task" CTA button visible

### FAB (Floating Action Button)
- [ ] FAB visible in bottom-right corner
- [ ] FAB has "+" icon
- [ ] Tapping FAB opens AddTaskScreen
- [ ] FAB has shadow/elevation
- [ ] FAB is accessible (44x44pt touch target)

### Testing
- [ ] ✅ Tested with 0 tasks
- [ ] ✅ Tested with 10 tasks
- [ ] ✅ Tested with 100+ tasks (performance)
- [ ] ✅ All filters tested
- [ ] ✅ Search tested with various queries
- [ ] ✅ Swipe gestures tested on both platforms

---

## ✅ US-2.4: Create Task Flow (8 pts)

### Screen Navigation
- [ ] AddTaskScreen opens from FAB on TaskListScreen
- [ ] AddTaskScreen opens from Dashboard quick actions
- [ ] Screen presented as modal on iOS
- [ ] Screen has "Add Task" title in header
- [ ] Cancel/Close button in header
- [ ] Save button in header (or bottom button)

### Form Fields
- [ ] **Title** field (required)
  - [ ] Placeholder text visible
  - [ ] Validation: Cannot be empty
  - [ ] Error message shows if empty on save attempt
- [ ] **Description** field (optional)
  - [ ] Multiline text input
  - [ ] Placeholder text visible
- [ ] **Priority** selector (default: 5 - Low)
  - [ ] Shows options 1-5 or High/Medium/Low
  - [ ] Visual indicator of selection
- [ ] **Due Date** picker (optional)
  - [ ] Opens date picker on tap
  - [ ] Displays selected date
  - [ ] Clear button to remove date
- [ ] **Project** selector (optional)
  - [ ] Shows list of user's projects
  - [ ] Displays project name and color
  - [ ] "None" option available

### Form Behavior
- [ ] All fields are initially empty/default
- [ ] Form validates on save
- [ ] Required field validation shows inline errors
- [ ] Save button disabled while loading
- [ ] Loading indicator shows during save
- [ ] Keyboard dismisses on save

### Success Flow
- [ ] Task created successfully via API
- [ ] Success toast notification shows
- [ ] Modal closes automatically
- [ ] User navigates back to TaskListScreen
- [ ] New task appears in task list immediately
- [ ] Task list scrolls to show new task (optional)

### Error Handling
- [ ] Network errors show toast message
- [ ] Validation errors show inline
- [ ] Form data persists if save fails
- [ ] User can retry save after error

### Keyboard Handling
- [ ] Keyboard doesn't overlap input fields
- [ ] KeyboardAvoidingView implemented
- [ ] "Done" button on keyboard saves form (iOS)
- [ ] Tab key moves between fields

### Testing
- [ ] ✅ Create task with all fields filled
- [ ] ✅ Create task with only required fields
- [ ] ✅ Test validation (empty title)
- [ ] ✅ Test date picker
- [ ] ✅ Test project selector
- [ ] ✅ Test success flow
- [ ] ✅ Test error handling (offline mode)

---

## ✅ US-2.5: Task Detail & Edit (5 pts)

### View Mode
- [ ] TaskDetailScreen displays all task information
- [ ] Read-only view on initial load
- [ ] All fields visible:
  - [ ] Title
  - [ ] Description
  - [ ] Priority (with label and color)
  - [ ] Status
  - [ ] Due Date
  - [ ] Project
  - [ ] Created date
  - [ ] Updated date (optional)
- [ ] Edit button in header
- [ ] Delete button in header (trash icon)

### Edit Mode
- [ ] Tapping "Edit" button enables editing
- [ ] All fields become editable
- [ ] "Save" button replaces "Edit" button
- [ ] "Cancel" button to revert changes
- [ ] Fields pre-filled with current values

### Save Changes
- [ ] Changes save to backend via API
- [ ] Loading indicator during save
- [ ] Success toast notification
- [ ] Screen returns to read-only mode
- [ ] Updated task displays immediately
- [ ] Task list updates with new data

### Delete Task
- [ ] Tapping delete shows confirmation dialog
- [ ] Confirmation message: "Delete this task?"
- [ ] "Cancel" and "Delete" buttons in dialog
- [ ] Tapping "Delete" soft-deletes task (status = 5)
- [ ] Success toast: "Task deleted"
- [ ] User navigates back to TaskListScreen
- [ ] Task removed from task list

### Error Handling
- [ ] Network errors show toast
- [ ] Validation errors show inline
- [ ] Failed delete shows error message
- [ ] User can retry after error

### Testing
- [ ] ✅ View task details
- [ ] ✅ Edit all fields
- [ ] ✅ Save changes successfully
- [ ] ✅ Cancel edit (no changes saved)
- [ ] ✅ Delete task with confirmation
- [ ] ✅ Test error handling

---

## ✅ US-2.6: Tasks API Integration & Redux (5 pts)

### Redux Slice (`tasksSlice.ts`)
- [ ] Slice created with TypeScript types
- [ ] Initial state defined
- [ ] Reducers implemented:
  - [ ] `setTasks` - Set all tasks
  - [ ] `addTask` - Add single task
  - [ ] `updateTask` - Update task
  - [ ] `deleteTask` - Remove task
  - [ ] `setLoading` - Set loading state
  - [ ] `setError` - Set error state

### Async Thunks
- [ ] `fetchTasks()` - GET /api/todo
  - [ ] Fetches all tasks from backend
  - [ ] Updates Redux state with tasks
  - [ ] Handles loading and error states
- [ ] `createTask(task)` - POST /api/todo
  - [ ] Creates task via API
  - [ ] Optimistic UI update (optional)
  - [ ] Returns created task
- [ ] `updateTask(id, updates)` - PATCH /api/todo/:id
  - [ ] Updates task via API
  - [ ] Updates Redux state
- [ ] `deleteTask(id)` - DELETE /api/todo/:id
  - [ ] Soft deletes task (status = 5)
  - [ ] Removes from Redux state

### API Client (`tasks.api.ts`)
- [ ] All endpoints defined
- [ ] TypeScript types for requests/responses
- [ ] Error handling for network errors
- [ ] Error handling for 401 (unauthorized)
- [ ] Request/response logging (development only)

### Optimistic Updates
- [ ] UI updates immediately on create
- [ ] UI updates immediately on edit
- [ ] UI updates immediately on delete
- [ ] Backend sync happens in background
- [ ] Rollback on API failure (optional for MVP)

### Loading States
- [ ] `loading` state in Redux
- [ ] Loading indicator in UI during fetch
- [ ] Loading indicator during create/update/delete
- [ ] Buttons disabled while loading

### Error Handling
- [ ] `error` state in Redux
- [ ] Error toast notifications
- [ ] Network errors handled gracefully
- [ ] 401 errors redirect to login
- [ ] Error messages are user-friendly

### Toast Notifications
- [ ] Success: "Task created"
- [ ] Success: "Task updated"
- [ ] Success: "Task deleted"
- [ ] Error: "Failed to create task"
- [ ] Error: "Network error. Please try again."

### Testing
- [ ] ✅ Unit tests for reducers
- [ ] ✅ Unit tests for thunks
- [ ] ✅ Integration test: Create task flow
- [ ] ✅ Integration test: Update task flow
- [ ] ✅ Integration test: Delete task flow
- [ ] ✅ Test optimistic updates
- [ ] ✅ Test error handling

---

## ✅ US-2.7: Task Swipe Gestures & Animations (3 pts)

### Swipe Right (Complete)
- [ ] Swipe right reveals green background
- [ ] "Checkmark" icon displays
- [ ] Label "Complete" displays
- [ ] Full swipe triggers action
- [ ] Task status updates to 6 (Completed)
- [ ] Task moves to "Completed" section or grays out
- [ ] Haptic feedback vibrates on iOS/Android

### Swipe Left (Delete)
- [ ] Swipe left reveals red background
- [ ] "Trash" icon displays
- [ ] Label "Delete" displays
- [ ] Full swipe shows confirmation dialog
- [ ] Confirmation required before delete
- [ ] Task soft-deleted (status = 5)
- [ ] Haptic feedback vibrates (warning)

### Animations
- [ ] Swipe animation is smooth (60 FPS)
- [ ] Background color transitions smoothly
- [ ] Icon fades in during swipe
- [ ] Threshold: 50% of card width to trigger
- [ ] Card bounces back if swipe incomplete

### Gesture Conflicts
- [ ] Swipe doesn't interfere with scroll
- [ ] Swipe works in both directions
- [ ] Tap on card still opens detail (no conflict)
- [ ] Long press doesn't trigger swipe

### Haptic Feedback
- [ ] Medium impact on complete (iOS)
- [ ] Notification warning on delete (iOS)
- [ ] Appropriate vibration on Android

### Testing
- [ ] ✅ Swipe right tested (complete)
- [ ] ✅ Swipe left tested (delete)
- [ ] ✅ Animations smooth on iOS
- [ ] ✅ Animations smooth on Android
- [ ] ✅ Haptic feedback tested
- [ ] ✅ No gesture conflicts
- [ ] ✅ Performance tested (no lag)

---

## 🧪 Sprint 2 Testing Requirements

### Unit Tests (Target: 80% coverage)
- [ ] `dateUtils.test.ts` - All utility functions
- [ ] `tasksSlice.test.ts` - All reducers and actions
- [ ] `TaskCard.test.tsx` - Component rendering
- [ ] `TaskFilters.test.tsx` - Filter logic
- [ ] `PrioritySelector.test.tsx` - Priority selection
- [ ] API client error handling tests

### Integration Tests
- [ ] Create task flow (E2E)
- [ ] Edit task flow (E2E)
- [ ] Delete task flow (E2E)
- [ ] Filter tasks test
- [ ] Search tasks test
- [ ] Swipe gestures test

### Manual Testing Checklist

#### iOS Testing
- [ ] iPhone 8 (smallest supported)
- [ ] iPhone 13 (common size)
- [ ] iPhone 15 Pro Max (largest)
- [ ] iPad (tablet support)
- [ ] Dark mode testing
- [ ] VoiceOver accessibility test

#### Android Testing
- [ ] Android API 26 (minimum supported)
- [ ] Android API 30 (common)
- [ ] Android API 34 (latest)
- [ ] Different screen sizes (5", 6", 7")
- [ ] TalkBack accessibility test

#### Functional Testing
- [ ] All user stories tested end-to-end
- [ ] Pull-to-refresh on all screens
- [ ] Empty states verified
- [ ] Loading states verified
- [ ] Error states tested (airplane mode)
- [ ] Offline behavior tested

#### Performance Testing
- [ ] Test with 0 tasks
- [ ] Test with 10 tasks
- [ ] Test with 100 tasks
- [ ] Test with 500 tasks
- [ ] Scroll performance (60 FPS)
- [ ] Memory usage acceptable
- [ ] No memory leaks

---

## 📱 Cross-Platform Verification

### iOS-Specific
- [ ] Safe area insets respected
- [ ] Navigation transitions smooth
- [ ] Haptic feedback works
- [ ] Date picker is native iOS picker
- [ ] Keyboard "Done" button works
- [ ] Status bar color correct

### Android-Specific
- [ ] FAB follows Material Design
- [ ] Ripple effects on touch
- [ ] Back button navigation works
- [ ] Date picker is Material picker
- [ ] Keyboard "Done" action works
- [ ] System navigation gestures don't conflict

---

## 🎨 Design Compliance

### Color Palette
- [ ] Primary: `#3B82F6` (blue-500)
- [ ] Success: `#10B981` (green-500)
- [ ] Warning: `#F59E0B` (amber-500)
- [ ] Error: `#EF4444` (red-500)
- [ ] Background: `#F9FAFB` (gray-50)
- [ ] Text Primary: `#1F2937` (gray-800)
- [ ] Text Secondary: `#6B7280` (gray-500)

### Typography
- [ ] Header: 24-28px, bold
- [ ] Title: 18-20px, semi-bold
- [ ] Body: 14-16px, regular
- [ ] Caption: 12px, regular

### Spacing
- [ ] Screen padding: 16px
- [ ] Card margin: 8px
- [ ] Border radius: 8px (cards), 12px (larger)

### Touch Targets
- [ ] All interactive elements ≥ 44x44pt
- [ ] FAB: 56x56px
- [ ] Tab bar height: 49px (iOS), 56px (Android)

---

## ♿ Accessibility Requirements

### Screen Reader Support
- [ ] All interactive elements have accessibilityLabel
- [ ] Navigation announces screen changes
- [ ] Form fields have accessibilityHint
- [ ] Error messages are announced

### Visual Accessibility
- [ ] Text contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators visible
- [ ] Color is not the only indicator (use icons + text)

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All actions accessible via keyboard
- [ ] Focus traps handled correctly

---

## 📊 Performance Metrics

### Target Metrics
- [ ] Screen load time < 500ms
- [ ] List scroll FPS = 60
- [ ] API response time < 500ms (p95)
- [ ] App size increase < 5 MB
- [ ] Memory usage < 100 MB (with 100 tasks)

### Actual Metrics (Fill in after testing)
- Screen load time: _____ ms
- List scroll FPS: _____ FPS
- API response time: _____ ms (p95)
- App size increase: _____ MB
- Memory usage: _____ MB

---

## ✅ Definition of Done (Sprint 2)

### Code Quality
- [ ] All code follows ESLint rules
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Code reviewed and approved
- [ ] All files have proper comments

### Testing
- [ ] Unit test coverage ≥ 80%
- [ ] All integration tests pass
- [ ] Manual testing complete (iOS + Android)
- [ ] No P0 or P1 bugs open
- [ ] Performance metrics met

### Documentation
- [ ] README updated
- [ ] Architecture documentation updated
- [ ] API integration documented
- [ ] Component props documented (JSDoc)

### Sprint Deliverables
- [ ] All 7 user stories complete
- [ ] 42 story points delivered
- [ ] Demo conducted with stakeholders
- [ ] Retrospective completed
- [ ] Sprint 3 planning done

---

## 🚀 Ready for Sprint 3?

Before starting Sprint 3 (Finance Management & Charts), verify:

- [ ] ✅ All Sprint 2 acceptance criteria met
- [ ] ✅ All tests passing
- [ ] ✅ No critical bugs
- [ ] ✅ Code merged to main branch
- [ ] ✅ App deployed to TestFlight/Internal Testing (optional)
- [ ] ✅ Team retrospective completed
- [ ] ✅ Lessons learned documented

---

**Checklist Version:** 1.0
**Last Updated:** November 17, 2025
**Status:** 📝 Ready for Validation
