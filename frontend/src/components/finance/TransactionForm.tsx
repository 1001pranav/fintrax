'use client';

import { useState } from 'react';
import InputField from '../Fields/InputField';
import SubmitButton from '../Fields/Button';
import {
  TRANSACTION_TYPES,
  getCategoriesForType,
  getTodayDate,
  TransactionType
} from '@/constants/financeConstants';

export interface TransactionFormData {
  source: string;
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
  notes: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<TransactionFormData>;
}

export default function TransactionForm({
  onSubmit,
  onCancel,
  initialData
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    source: initialData?.source || '',
    amount: initialData?.amount || '',
    type: initialData?.type || TRANSACTION_TYPES.EXPENSE,
    category: initialData?.category || '',
    date: initialData?.date || getTodayDate(),
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Source validation
    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amountNum = parseFloat(formData.amount);
      if (isNaN(amountNum)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (amountNum <= 0) {
        newErrors.amount = 'Amount must be greater than zero';
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        source: '',
        amount: '',
        type: TRANSACTION_TYPES.EXPENSE,
        category: '',
        date: getTodayDate(),
        notes: '',
      });
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create transaction'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof TransactionFormData, value: string | TransactionType) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Reset category when type changes
      if (field === 'type' && value !== prev.type) {
        updated.category = '';
      }

      return updated;
    });

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const categories = getCategoriesForType(formData.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">
          Transaction Type <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateField('type', TRANSACTION_TYPES.INCOME)}
            className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg transition-all duration-200 touch-manipulation ${
              formData.type === TRANSACTION_TYPES.INCOME
                ? 'bg-green-500/20 border-2 border-green-400 text-green-300'
                : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/15 active:bg-white/20'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => updateField('type', TRANSACTION_TYPES.EXPENSE)}
            className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg transition-all duration-200 touch-manipulation ${
              formData.type === TRANSACTION_TYPES.EXPENSE
                ? 'bg-red-500/20 border-2 border-red-400 text-red-300'
                : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/15 active:bg-white/20'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Source Field */}
      <div>
        <InputField
          type="text"
          label="Source"
          placeholder={formData.type === TRANSACTION_TYPES.INCOME ? "e.g., Monthly Salary" : "e.g., Grocery Store"}
          value={formData.source}
          onChange={(value) => updateField('source', value)}
          required
        />
        {errors.source && (
          <p className="text-red-400 text-sm mt-1">{errors.source}</p>
        )}
      </div>

      {/* Amount Field */}
      <div>
        <InputField
          type="number"
          label="Amount"
          placeholder="0.00"
          value={formData.amount}
          onChange={(value) => updateField('amount', value)}
          required
        />
        {errors.amount && (
          <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          className="w-full min-h-[44px] px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 hover:bg-white/15 touch-manipulation text-base"
          required
        >
          <option value="" className="bg-gray-800">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-gray-800">
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Date Picker */}
      <div>
        <InputField
          type="date"
          label="Date"
          placeholder=""
          value={formData.date}
          onChange={(value) => updateField('date', value)}
          required
        />
        {errors.date && (
          <p className="text-red-400 text-sm mt-1">{errors.date}</p>
        )}
      </div>

      {/* Notes Field (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 hover:bg-white/15 resize-none touch-manipulation text-base"
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-500/10 border border-red-400/50 rounded-lg">
          <p className="text-red-400 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[48px] py-3 px-6 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 touch-manipulation"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <div className={onCancel ? 'flex-1' : 'w-full'}>
          <SubmitButton
            isLoading={isSubmitting}
            loadingText="Saving..."
            submitText="Add Transaction"
          />
        </div>
      </div>
    </form>
  );
}
