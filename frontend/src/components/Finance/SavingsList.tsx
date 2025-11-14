'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import SavingsCard from './SavingsCard';
import SavingsModal from './SavingsModal';
import { SavingsFormData } from './SavingsForm';
import { CreateSavingsData } from '@/lib/api';

interface SavingsGoal {
  id?: number;
  name: string;
  amount: number;
  target: number;
  rate?: number;
  category: string;
}

export default function SavingsList() {
  const {
    financialData,
    createSavings,
    updateSavings,
    deleteSavings,
    isLoading
  } = useFinanceStore();

  const savingsGoals = financialData.savings.goals;

  // Modal state for add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSavings, setEditingSavings] = useState<SavingsGoal | null>(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleAddClick = () => {
    setEditingSavings(null);
    setIsModalOpen(true);
  };

  const handleEdit = (savings: SavingsGoal) => {
    setEditingSavings(savings);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await deleteSavings(deleteConfirmId);
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Failed to delete savings goal:', error);
      }
    }
  };

  const handleModalSubmit = async (data: SavingsFormData) => {
    try {
      const savingsData: CreateSavingsData = {
        name: data.name,
        amount: parseFloat(data.amount),
        target_amount: parseFloat(data.target_amount),
        rate: data.rate ? parseFloat(data.rate) : 0,
      };

      if (editingSavings && editingSavings.id) {
        // Update existing savings goal
        await updateSavings(editingSavings.id, savingsData);
      } else {
        // Create new savings goal
        await createSavings(savingsData);
      }
    } catch (error) {
      console.error('Failed to save savings goal:', error);
      throw error;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSavings(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Savings Goals</h2>
          <p className="text-white/60 text-sm mt-1">
            {savingsGoals.length} goal{savingsGoals.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          + Add Goal
        </button>
      </div>

      {/* Loading State */}
      {isLoading && savingsGoals.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            <p className="text-white/60">Loading savings goals...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && savingsGoals.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-xl text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white/10 rounded-full">
              <svg className="w-12 h-12 text-green-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No savings goals yet
              </h3>
              <p className="text-white/60">
                Start building your financial future by creating your first savings goal.
              </p>
            </div>
            <button
              onClick={handleAddClick}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Create Savings Goal
            </button>
          </div>
        </div>
      )}

      {/* Savings List */}
      {!isLoading && savingsGoals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {savingsGoals.map((savings, index) => (
            <SavingsCard
              key={savings.id || index}
              savings={savings}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <SavingsModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          title={editingSavings ? 'Edit Savings Goal' : 'Add Savings Goal'}
          isEditing={!!editingSavings}
          initialData={
            editingSavings
              ? {
                  name: editingSavings.name,
                  amount: editingSavings.amount.toString(),
                  target_amount: editingSavings.target.toString(),
                  rate: editingSavings.rate?.toString() || '0',
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
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Delete Savings Goal?</h3>
                <p className="text-white/60">
                  Are you sure you want to delete this savings goal? This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
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
