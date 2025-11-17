/**
 * Finance Slice
 * Redux slice for financial data state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeApi } from '../../api';
import { sqliteService, offlineManager } from '../../services';
import {
  Transaction,
  Savings,
  Loan,
  FinanceSummary,
  SyncOperationType,
  SyncEntity,
  SyncStatus,
} from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

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
      if (offlineManager.isConnected()) {
        const transactions = await financeApi.getTransactions();
        for (const transaction of transactions) {
          const existing = await sqliteService.getById<Transaction>(
            'transactions',
            transaction.id
          );
          if (existing) {
            await sqliteService.update('transactions', transaction.id, transaction);
          } else {
            await sqliteService.insert('transactions', transaction);
          }
        }
        return transactions;
      } else {
        const transactions = await sqliteService.getAll<Transaction>('transactions');
        return transactions;
      }
    } catch (error: any) {
      const transactions = await sqliteService.getAll<Transaction>('transactions');
      return transactions;
    }
  }
);

export const createTransaction = createAsyncThunk(
  'finance/createTransaction',
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const localId = uuidv4();
      const transaction: Transaction = {
        id: localId,
        amount: transactionData.amount!,
        category: transactionData.category!,
        description: transactionData.description || '',
        type: transactionData.type!,
        date: transactionData.date!,
        userId: transactionData.userId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        localId,
        syncStatus: SyncStatus.PENDING,
      };

      await sqliteService.insert('transactions', transaction);
      await offlineManager.queueOperation(
        SyncOperationType.CREATE,
        SyncEntity.TRANSACTION,
        localId,
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
      await sqliteService.update('transactions', id, {
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: SyncStatus.PENDING,
      });

      await offlineManager.queueOperation(
        SyncOperationType.UPDATE,
        SyncEntity.TRANSACTION,
        id,
        updates
      );

      const transaction = await sqliteService.getById<Transaction>(
        'transactions',
        id
      );
      return transaction!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'finance/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await sqliteService.delete('transactions', id);
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
