'use client';

import { useState } from 'react';
import InputField from '../Fields/InputField';
import SubmitButton from '../Fields/Button';

export interface LoanFormData {
  name: string;
  total_amount: string;
  rate: string;
  term: string;
  duration: string;
  premium_amount: string;
}

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<LoanFormData>;
  isEditing?: boolean;
}

export default function LoanForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}: LoanFormProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    name: initialData?.name || '',
    total_amount: initialData?.total_amount || '',
    rate: initialData?.rate || '0',
    term: initialData?.term || '1',
    duration: initialData?.duration || '',
    premium_amount: initialData?.premium_amount || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Loan name is required';
    }

    // Total Amount validation
    if (!formData.total_amount) {
      newErrors.total_amount = 'Total amount is required';
    } else {
      const amountNum = parseFloat(formData.total_amount);
      if (isNaN(amountNum)) {
        newErrors.total_amount = 'Amount must be a valid number';
      } else if (amountNum <= 0) {
        newErrors.total_amount = 'Amount must be greater than zero';
      }
    }

    // Interest Rate validation (optional)
    if (formData.rate) {
      const rateNum = parseFloat(formData.rate);
      if (isNaN(rateNum)) {
        newErrors.rate = 'Rate must be a valid number';
      } else if (rateNum < 0) {
        newErrors.rate = 'Rate cannot be negative';
      }
    }

    // Term validation
    if (formData.term) {
      const termNum = parseInt(formData.term);
      if (isNaN(termNum) || termNum < 1 || termNum > 4) {
        newErrors.term = 'Please select a valid payment term';
      }
    }

    // Duration validation (optional)
    if (formData.duration) {
      const durationNum = parseInt(formData.duration);
      if (isNaN(durationNum)) {
        newErrors.duration = 'Duration must be a valid number';
      } else if (durationNum <= 0) {
        newErrors.duration = 'Duration must be greater than zero';
      }
    }

    // Premium Amount validation (optional)
    if (formData.premium_amount) {
      const premiumNum = parseFloat(formData.premium_amount);
      if (isNaN(premiumNum)) {
        newErrors.premium_amount = 'Premium must be a valid number';
      } else if (premiumNum < 0) {
        newErrors.premium_amount = 'Premium cannot be negative';
      }
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
      // Reset form after successful submission (only if not editing)
      if (!isEditing) {
        setFormData({
          name: '',
          total_amount: '',
          rate: '0',
          term: '1',
          duration: '',
          premium_amount: '',
        });
      }
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save loan'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof LoanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <InputField
          type="text"
          label="Loan Name"
          placeholder="e.g., Home Loan, Car Loan, Personal Loan"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          required
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Total Amount Field */}
      <div>
        <InputField
          type="number"
          label="Total Loan Amount"
          placeholder="0.00"
          value={formData.total_amount}
          onChange={(value) => updateField('total_amount', value)}
          required
        />
        {errors.total_amount && (
          <p className="text-red-400 text-sm mt-1">{errors.total_amount}</p>
        )}
      </div>

      {/* Interest Rate Field */}
      <div>
        <InputField
          type="number"
          label="Interest Rate (Optional)"
          placeholder="0.00"
          value={formData.rate}
          onChange={(value) => updateField('rate', value)}
        />
        {errors.rate && (
          <p className="text-red-400 text-sm mt-1">{errors.rate}</p>
        )}
        <p className="text-white/50 text-xs mt-1">
          Enter the annual interest rate (%)
        </p>
      </div>

      {/* Payment Term Field */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Payment Term
        </label>
        <select
          value={formData.term}
          onChange={(e) => updateField('term', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
        >
          <option value="1">Monthly</option>
          <option value="2">Quarterly</option>
          <option value="3">Semi-Annually</option>
          <option value="4">Annually</option>
        </select>
        {errors.term && (
          <p className="text-red-400 text-sm mt-1">{errors.term}</p>
        )}
      </div>

      {/* Duration Field */}
      <div>
        <InputField
          type="number"
          label="Duration (Optional)"
          placeholder="e.g., 60 for 5 years"
          value={formData.duration}
          onChange={(value) => updateField('duration', value)}
        />
        {errors.duration && (
          <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
        )}
        <p className="text-white/50 text-xs mt-1">
          Enter loan duration in months
        </p>
      </div>

      {/* Premium Amount Field */}
      <div>
        <InputField
          type="number"
          label="Payment Amount (Optional)"
          placeholder="0.00"
          value={formData.premium_amount}
          onChange={(value) => updateField('premium_amount', value)}
        />
        {errors.premium_amount && (
          <p className="text-red-400 text-sm mt-1">{errors.premium_amount}</p>
        )}
        <p className="text-white/50 text-xs mt-1">
          Enter the payment amount per term
        </p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-500/10 border border-red-400/50 rounded-lg">
          <p className="text-red-400 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/15 text-gray-900 dark:text-white font-semibold rounded-xl border  border-gray-300 dark:border-white/20 transition-all duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <div className={onCancel ? 'flex-1' : 'w-full'}>
          <SubmitButton
            isLoading={isSubmitting}
            loadingText={isEditing ? "Updating..." : "Saving..."}
            submitText={isEditing ? "Update Loan" : "Add Loan"}
          />
        </div>
      </div>
    </form>
  );
}
