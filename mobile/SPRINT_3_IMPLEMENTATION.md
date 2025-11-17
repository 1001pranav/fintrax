# Sprint 3: Finance Management & Charts - Implementation Guide

**Sprint Goal:** Build finance tracking features with transaction management and charts

**Story Points:** 40
**Estimated Hours:** 76h
**Status:** 🚧 In Progress

---

## Overview

Sprint 3 implements the complete finance management system including:
- Finance dashboard with balance and summaries
- Transaction management (create, list, filter, delete)
- Financial charts (income/expense trends, category breakdown)
- Savings and loans viewing
- Full offline support with Redux integration

---

## User Stories Breakdown

### ✅ US-3.1: Finance Dashboard Screen (8 points)
**Files to create:**
- `src/screens/finance/FinanceScreen.tsx` - Main finance dashboard
- `src/components/finance/BalanceCard.tsx` - Balance display
- `src/components/finance/MonthlySummary.tsx` - Income vs expense summary

**Features:**
- Display current balance with large prominent card
- Show monthly income vs expense comparison
- Quick action buttons (Add Transaction, View All)
- Recent transactions list (last 10)
- Pull-to-refresh functionality
- Navigation to transaction list and add screens

---

### ✅ US-3.2: Add Transaction Flow (8 points)
**Files to create:**
- `src/screens/finance/AddTransactionScreen.tsx` - Add/Edit transaction form
- `src/components/finance/CategoryPicker.tsx` - Category selector with icons
- `src/components/common/AmountInput.tsx` - Number input for amount
- `src/constants/financeCategories.ts` - Category definitions with icons

**Features:**
- Type toggle (Income/Expense) with visual indicator
- Large amount input with number formatting
- Category picker with predefined categories and icons
- Description/source text input
- Date picker (defaults to today)
- Form validation
- Success feedback and navigation

**Categories:**
- **Income:** Salary, Freelance, Investment, Gift, Other
- **Expense:** Food, Transport, Housing, Shopping, Entertainment, Healthcare, Bills, Education, Other

---

### ✅ US-3.3: Transaction List & Filters (8 points)
**Files to create:**
- `src/screens/finance/TransactionListScreen.tsx` - Full transaction list
- `src/components/finance/TransactionCard.tsx` - Individual transaction display
- `src/components/finance/TransactionFilters.tsx` - Filter controls

**Features:**
- Display all transactions in chronological order (newest first)
- Group by date (Today, Yesterday, This Week, Older)
- Filter by date range (This Month, Last Month, Custom)
- Filter by type (Income, Expense, All)
- Filter by category (multi-select)
- Search by description
- Swipe-to-delete with confirmation
- Tap to edit transaction
- Empty state when no transactions
- Pull-to-refresh

---

### ✅ US-3.4: Financial Charts (8 points)
**Files to create:**
- `src/components/finance/IncomeExpenseChart.tsx` - Line chart for trends
- `src/components/finance/CategoryPieChart.tsx` - Pie chart for expenses
- `src/components/finance/BalanceTrendChart.tsx` - Area chart for balance
- `src/utils/chartDataProcessors.ts` - Data transformation utilities

**Charts:**
1. **Income vs Expense Line Chart**
   - Shows monthly trends for last 6 months
   - Two lines (income in green, expense in red)
   - Interactive tooltips
   - Time period selector (1M, 3M, 6M, 1Y)

2. **Category Pie Chart**
   - Breakdown of expenses by category
   - Shows percentages
   - Category colors match icons
   - Top 5 categories + "Other"

3. **Balance Trend Area Chart**
   - Shows balance over time
   - Filled area chart
   - Positive balance in green, negative in red

**Library:** `react-native-chart-kit` or `Victory Native`

---

### ✅ US-3.5: Finance API Integration & Redux (5 points)
**Already implemented in Sprint 1, enhancements needed:**
- ✅ financeSlice with CRUD operations
- ✅ Offline sync support
- ✅ Optimistic updates
- ✅ Error handling
- Enhancements: Balance calculation from local data

---

### ✅ US-3.6: Savings & Loans Screens (3 points)
**Files to create:**
- `src/screens/finance/SavingsScreen.tsx` - Savings list
- `src/screens/finance/LoansScreen.tsx` - Loans list
- `src/components/finance/SavingsCard.tsx` - Savings item display
- `src/components/finance/LoanCard.tsx` - Loan item display

**Features:**
- **Savings:** Name, current amount, goal, progress bar, interest rate
- **Loans:** Name, original amount, remaining balance, EMI, interest rate
- View-only for MVP (CRUD deferred to post-MVP)
- Empty states with helpful messages
- Navigation from Finance screen

---

## Navigation Structure

```
Finance Tab
├── FinanceScreen (Dashboard)
│   ├── Add Transaction (Modal)
│   ├── Transaction List
│   │   └── Transaction Detail/Edit
│   ├── Savings List
│   └── Loans List
```

**Navigator to create:**
- `src/navigation/FinanceNavigator.tsx` - Stack navigator for Finance section

---

## File Structure

```
mobile/src/
├── screens/
│   └── finance/
│       ├── FinanceScreen.tsx              ⏳ Main dashboard
│       ├── AddTransactionScreen.tsx       ⏳ Add/Edit transaction
│       ├── TransactionListScreen.tsx      ⏳ All transactions
│       ├── SavingsScreen.tsx              ⏳ Savings list
│       └── LoansScreen.tsx                ⏳ Loans list
│
├── components/
│   ├── finance/
│   │   ├── BalanceCard.tsx                ⏳ Balance display
│   │   ├── MonthlySummary.tsx             ⏳ Income/expense summary
│   │   ├── CategoryPicker.tsx             ⏳ Category selector
│   │   ├── TransactionCard.tsx            ⏳ Transaction item
│   │   ├── TransactionFilters.tsx         ⏳ Filter controls
│   │   ├── IncomeExpenseChart.tsx         ⏳ Line chart
│   │   ├── CategoryPieChart.tsx           ⏳ Pie chart
│   │   ├── BalanceTrendChart.tsx          ⏳ Area chart
│   │   ├── SavingsCard.tsx                ⏳ Savings item
│   │   └── LoanCard.tsx                   ⏳ Loan item
│   │
│   └── common/
│       └── AmountInput.tsx                ⏳ Number input
│
├── constants/
│   └── financeCategories.ts               ⏳ Category definitions
│
├── utils/
│   └── chartDataProcessors.ts             ⏳ Chart data utilities
│
└── navigation/
    └── FinanceNavigator.tsx               ⏳ Stack navigator
```

---

## Implementation Order

### Phase 1: Constants & Components (Days 1-2)
1. ✅ Create `financeCategories.ts` with category definitions
2. ✅ Create `AmountInput.tsx` component
3. ✅ Create `CategoryPicker.tsx` component
4. ✅ Create `BalanceCard.tsx` component
5. ✅ Create `MonthlySummary.tsx` component
6. ✅ Create `TransactionCard.tsx` component

### Phase 2: Main Screens (Days 3-4)
1. ✅ Create `FinanceScreen.tsx` (Dashboard)
2. ✅ Create `AddTransactionScreen.tsx`
3. ✅ Create `TransactionListScreen.tsx`
4. ✅ Create `TransactionFilters.tsx`
5. ✅ Test transaction CRUD flows

### Phase 3: Charts (Days 5-6)
1. ✅ Install chart library (`react-native-chart-kit`)
2. ✅ Create `chartDataProcessors.ts`
3. ✅ Create `IncomeExpenseChart.tsx`
4. ✅ Create `CategoryPieChart.tsx`
5. ✅ Create `BalanceTrendChart.tsx`
6. ✅ Integrate charts into FinanceScreen

### Phase 4: Savings & Loans (Day 7)
1. ✅ Create `SavingsCard.tsx` and `SavingsScreen.tsx`
2. ✅ Create `LoanCard.tsx` and `LoansScreen.tsx`
3. ✅ Test data fetching and display

### Phase 5: Navigation & Integration (Day 8)
1. ✅ Create `FinanceNavigator.tsx`
2. ✅ Update `MainNavigator.tsx`
3. ✅ Test all navigation flows
4. ✅ Test offline sync

### Phase 6: Testing & Polish (Days 9-10)
1. ⏳ Unit tests for chart processors
2. ⏳ Integration tests for transaction flows
3. ⏳ Manual testing on iOS and Android
4. ⏳ Performance testing with large datasets
5. ⏳ Bug fixes and polish

---

## API Endpoints Used

```typescript
// Finance API (already implemented)
GET    /api/dashboard                  // Get balance and summary
GET    /api/transactions               // Get all transactions
POST   /api/transactions               // Create transaction
PATCH  /api/transactions/:id           // Update transaction
DELETE /api/transactions/:id           // Delete transaction
GET    /api/savings                    // Get all savings
GET    /api/loans                      // Get all loans
```

---

## Redux State Structure

```typescript
interface FinanceState {
  transactions: Transaction[];
  savings: Savings[];
  loans: Loan[];
  summary: FinanceSummary | null;
  isLoading: boolean;
  error: string | null;
}
```

**Actions:**
- `fetchDashboard()` - Fetch balance and summary
- `fetchTransactions()` - Fetch all transactions
- `createTransaction()` - Create new transaction
- `updateTransaction()` - Update existing transaction
- `deleteTransaction()` - Delete transaction
- `clearError()` - Clear error state

---

## Styling Guidelines

### Colors
```typescript
// Transaction Types
INCOME: '#10B981'      // Green
EXPENSE: '#EF4444'     // Red

// Categories (examples)
Food: '#F59E0B'        // Orange
Transport: '#3B82F6'   // Blue
Housing: '#8B5CF6'     // Purple
Shopping: '#EC4899'    // Pink
Entertainment: '#F97316' // Orange
Healthcare: '#14B8A6'  // Teal
```

### Typography
- Balance amount: 32-36px, bold
- Section titles: 18-20px, semibold
- Transaction amounts: 16-18px, semibold
- Descriptions: 14-15px, regular

### Spacing
- Card padding: 16px
- Section spacing: 24px
- List item padding: 12-16px

---

## Testing Checklist

### Unit Tests
- [ ] Chart data processors
- [ ] Category utilities
- [ ] Amount formatting
- [ ] Date grouping logic

### Integration Tests
- [ ] Create transaction flow
- [ ] Edit transaction flow
- [ ] Delete transaction flow
- [ ] Filter transactions
- [ ] Chart data rendering

### Manual Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test with 100+ transactions
- [ ] Test offline transaction creation
- [ ] Test sync after going online
- [ ] Test charts with different date ranges
- [ ] Test all category filters
- [ ] Test swipe gestures
- [ ] Test form validation

---

## Acceptance Criteria Summary

### US-3.1: Finance Dashboard
- [x] Balance card displays current balance
- [x] Monthly summary shows income, expenses, net
- [x] Quick actions navigate to add transaction
- [x] Recent transactions list shows last 10 items
- [x] Pull-to-refresh updates data
- [x] Tapping transaction opens detail screen

### US-3.2: Add Transaction
- [x] Type toggle switches between income/expense
- [x] Amount input shows large number pad
- [x] Category picker shows predefined categories with icons
- [x] Date picker defaults to today
- [x] Transaction creates successfully
- [x] Balance updates immediately
- [x] Form validation works
- [x] Success feedback shown

### US-3.3: Transaction List
- [x] All transactions display chronologically
- [x] Transactions grouped by date
- [x] Date range filter works
- [x] Type filter works (Income, Expense, All)
- [x] Category filter works
- [x] Search filters by description
- [x] Swipe-to-delete with confirmation
- [x] Tap to edit
- [x] Empty state displays

### US-3.4: Charts
- [x] Income vs Expense chart shows monthly trend
- [x] Category pie chart shows expense breakdown
- [x] Balance trend chart shows balance over time
- [x] Time period selector filters data
- [x] Charts are interactive
- [x] Charts render on different screen sizes
- [x] Loading state while calculating
- [x] Empty state when no data

### US-3.6: Savings & Loans
- [x] Savings screen displays all savings
- [x] Progress bars show growth
- [x] Loans screen displays all loans
- [x] EMI and remaining balance shown
- [x] Data fetches from API
- [x] Empty states display

---

## Next Steps

1. **Install chart library:**
   ```bash
   cd mobile
   npm install react-native-chart-kit react-native-svg
   ```

2. **Start with Phase 1:** Create constants and basic components

3. **Follow implementation order** for systematic progress

4. **Test frequently** on both iOS and Android

5. **Document progress** in SPRINT_3_PROGRESS.md

---

**Document Version:** 1.0
**Last Updated:** November 17, 2025
**Status:** Ready for Implementation
