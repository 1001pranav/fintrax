/**
 * Finance Slice (US-4.4)
 * Redux slice for financial data state management with offline support
 * Uses Repository Pattern for data access abstraction
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeApi } from '../../api';
import { offlineManager } from '../../services';
import { transactionRepository } from '../../database/helpers';
import {
  Transaction,
  Savings,
  Loan,
  FinanceSummary,
  SyncOperationType,
  SyncEntity,
  SyncStatus,
} from '../../constants/types';

interface FinanceState {
  transactions: Transaction[];
  savings: Savings[];
  loans: Loan[];
  summary: FinanceSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  transactions: [],
  savings: [],
  loans: [],
  summary: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchDashboard = createAsyncThunk(
  'finance/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const summary = await financeApi.getDashboard();
      return summary;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'finance/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      // Always load from local database first (offline-first) (US-4.4)
      const localTransactions = await transactionRepository.getAll();

      // If online, fetch from server and update local database
      if (offlineManager.isConnected()) {
        try {
          const serverTransactions = await financeApi.getTransactions();

          // Update local database with server data
          for (const serverTransaction of serverTransactions) {
            const existing = await transactionRepository.getById(
              serverTransaction.id
            );
            if (existing) {
              await transactionRepository.update(serverTransaction.id, {
                ...serverTransaction,
                syncStatus: SyncStatus.SYNCED,
              });
            } else {
              await transactionRepository.create({
                ...serverTransaction,
                syncStatus: SyncStatus.SYNCED,
              });
            }
          }

          return await transactionRepository.getAll();
        } catch (serverError) {
          console.warn('Server fetch failed, using local data:', serverError);
          return localTransactions;
        }
      }

      return localTransactions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'finance/createTransaction',
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      // Create transaction using repository (US-4.4)
      const transaction = await transactionRepository.create({
        amount: transactionData.amount!,
        category: transactionData.category!,
        description: transactionData.description || '',
        type: transactionData.type!,
        date: transactionData.date!,
        userId: transactionData.userId!,
        syncStatus: SyncStatus.PENDING,
      });

      await offlineManager.queueOperation(
        SyncOperationType.CREATE,
        SyncEntity.TRANSACTION,
        transaction.id,
        transactionData
      );

      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'finance/updateTransaction',
  async (
    { id, updates }: { id: string; updates: Partial<Transaction> },
    { rejectWithValue }
  ) => {
    try {
      // Update using repository (US-4.4)
      const transaction = await transactionRepository.update(id, {
        ...updates,
        syncStatus: SyncStatus.PENDING,
      });

      await offlineManager.queueOperation(
        SyncOperationType.UPDATE,
        SyncEntity.TRANSACTION,
        id,
        updates
      );

      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'finance/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      // Soft delete using repository (US-4.4)
      await transactionRepository.delete(id);
      await offlineManager.queueOperation(
        SyncOperationType.DELETE,
        SyncEntity.TRANSACTION,
        id,
        {}
      );

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete transaction');
    }
  }
);

// Slice
const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder.addCase(fetchDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.summary = action.payload;
      state.savings = action.payload.savings;
      state.loans = action.payload.loans;
    });
    builder.addCase(fetchDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Transactions
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });

    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.transactions.push(action.payload);
    });

    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    });

    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    });
  },
});

export const { clearError } = financeSlice.actions;
export default financeSlice.reducer;
