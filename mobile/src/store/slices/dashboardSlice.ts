/**
 * Dashboard Slice
 * Redux slice for dashboard state management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../../api';
import { DashboardSummary, Task, Transaction } from '../../types/models.types';

interface DashboardState {
  balance: number;
  netWorth: number;
  recentTasks: Task[];
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  lastFetch: string | null;
}

const initialState: DashboardState = {
  balance: 0,
  netWorth: 0,
  recentTasks: [],
  recentTransactions: [],
  loading: false,
  error: null,
  lastFetch: null,
};

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getSummary();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    updateNetWorth: (state, action: PayloadAction<number>) => {
      state.netWorth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchDashboardData.fulfilled,
      (state, action: PayloadAction<DashboardSummary>) => {
        state.loading = false;
        state.balance = action.payload.total_balance || 0;
        state.netWorth = action.payload.net_worth || 0;
        state.recentTasks = action.payload.recent_tasks || [];
        state.recentTransactions = action.payload.recent_transactions || [];
        state.lastFetch = new Date().toISOString();
      }
    );
    builder.addCase(fetchDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, updateBalance, updateNetWorth } = dashboardSlice.actions;
export default dashboardSlice.reducer;
