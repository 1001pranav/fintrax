'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import LoanCard from './LoanCard';
import LoanModal from './LoanModal';
import { LoanFormData } from './LoanForm';
import { CreateLoanData } from '@/lib/api';

interface LoanItem {
  id?: number;
  name: string;
  total_amount: number;
  rate?: number;
  term?: number;
  duration?: number;
  premium_amount?: number;
}

export default function LoanList() {
  const {
    loans,
    createLoan,
    updateLoan,
    deleteLoan,
    isLoading
  } = useFinanceStore();

  // Map loans to LoanItem format
  const loanItems: LoanItem[] = loans.map(loan => ({
    id: loan.loan_id,
    name: loan.name,
    total_amount: loan.total_amount,
    rate: loan.rate,
    term: loan.term,
    duration: loan.duration,
    premium_amount: loan.premium_amount,
  }));

  // Modal state for add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanItem | null>(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleAddClick = () => {
    setEditingLoan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (loan: LoanItem) => {
    setEditingLoan(loan);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await deleteLoan(deleteConfirmId);
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Failed to delete loan:', error);
      }
    }
  };

  const handleModalSubmit = async (data: LoanFormData) => {
    try {
      const loanData: CreateLoanData = {
        name: data.name,
        total_amount: parseFloat(data.total_amount),
        rate: data.rate ? parseFloat(data.rate) : 0,
        term: data.term ? parseInt(data.term) : 1,
        duration: data.duration ? parseInt(data.duration) : 0,
        premium_amount: data.premium_amount ? parseFloat(data.premium_amount) : 0,
      };

      if (editingLoan && editingLoan.id) {
        // Update existing loan
        await updateLoan(editingLoan.id, loanData);
      } else {
        // Create new loan
        await createLoan(loanData);
      }
    } catch (error) {
      console.error('Failed to save loan:', error);
      throw error;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingLoan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Loans & Debts</h2>
          <p className="text-white/60 text-sm mt-1">
            {loanItems.length} loan{loanItems.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          + Add Loan
        </button>
      </div>

      {/* Loading State */}
      {isLoading && loanItems.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
            <p className="text-white/60">Loading loans...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && loanItems.length === 0 && (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-12 backdrop-blur-xl text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white/10 rounded-full">
              <svg className="w-12 h-12 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No loans yet
              </h3>
              <p className="text-white/60">
                Track your loans and manage repayment schedules effectively.
              </p>
            </div>
            <button
              onClick={handleAddClick}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-200"
            >
              Add Your First Loan
            </button>
          </div>
        </div>
      )}

      {/* Loans List */}
      {!isLoading && loanItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loanItems.map((loan, index) => (
            <LoanCard
              key={loan.id || index}
              loan={loan}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <LoanModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          title={editingLoan ? 'Edit Loan' : 'Add Loan'}
          isEditing={!!editingLoan}
          initialData={
            editingLoan
              ? {
                  name: editingLoan.name,
                  total_amount: editingLoan.total_amount.toString(),
                  rate: editingLoan.rate?.toString() || '0',
                  term: editingLoan.term?.toString() || '1',
                  duration: editingLoan.duration?.toString() || '',
                  premium_amount: editingLoan.premium_amount?.toString() || '',
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
          <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border  border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Warning Icon */}
              <div className="p-3 bg-red-500/20 rounded-full">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Loan?</h3>
                <p className="text-white/60">
                  Are you sure you want to delete this loan? This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/15 text-gray-900 dark:text-white font-semibold rounded-xl border  border-gray-300 dark:border-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-200"
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
