'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import { Transaction } from '@/lib/api';
import { api } from '@/lib/api';
import TransactionCard from './TransactionCard';
import TransactionFiltersComponent, { TransactionFilters } from './TransactionFilters';
import TransactionModal from '../finance/TransactionModal';
import { TransactionFormData } from '../finance/TransactionForm';

export default function TransactionList() {
  const { transactions, fetchTransactions, deleteTransaction, isLoading } = useFinanceStore();
  const [filters, setFilters] = useState<TransactionFilters>({
    type: null,
    category: '',
    startDate: '',
    endDate: '',
  });

  // Modal state for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch transactions on mount
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filters.type !== null) {
      result = result.filter((t) => t.type === filters.type);
    }

    // Filter by category
    if (filters.category) {
      result = result.filter((t) => t.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by date range
    if (filters.startDate) {
      result = result.filter((t) => new Date(t.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter((t) => new Date(t.date) <= new Date(filters.endDate));
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [transactions, filters]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await deleteTransaction(deleteConfirmId);
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleModalSubmit = async (data: TransactionFormData) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        await api.transactions.update(editingTransaction.id, {
          source: data.source,
          amount: parseFloat(data.amount),
          type: data.type,
          category: data.category,
          date: data.date,
        });

        // Refresh transactions
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Transaction History</h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <TransactionFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-white/60">Loading transactions...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTransactions.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 backdrop-blur-xl text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 sm:p-4 bg-white/10 rounded-full">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
              </h3>
              <p className="text-white/60 text-sm sm:text-base">
                {transactions.length === 0
                  ? 'Start tracking your finances by adding your first transaction.'
                  : 'Try adjusting your filters to see more transactions.'}
              </p>
            </div>
            {transactions.length === 0 && (
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 min-h-[48px] px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white font-semibold rounded-xl transition-all duration-200 touch-manipulation"
              >
                Add Transaction
              </button>
            )}
          </div>
        </div>
      )}

      {/* Transaction List */}
      {!isLoading && filteredTransactions.length > 0 && (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          initialData={
            editingTransaction
              ? {
                  source: editingTransaction.source,
                  amount: editingTransaction.amount.toString(),
                  type: editingTransaction.type as 1 | 2,
                  category: editingTransaction.category,
                  date: editingTransaction.date,
                  notes: '',
                }
              : undefined
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Warning Icon */}
              <div className="p-3 bg-red-500/20 rounded-full">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Delete Transaction?</h3>
                <p className="text-white/60 text-sm sm:text-base">
                  Are you sure you want to delete this transaction? This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 min-h-[48px] py-3 px-6 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 min-h-[48px] py-3 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl transition-all duration-200 touch-manipulation"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
