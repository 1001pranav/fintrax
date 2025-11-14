'use client';

import { useState } from 'react';
import InputField from '../Fields/InputField';
import SubmitButton from '../Fields/Button';

export interface SavingsFormData {
  name: string;
  amount: string;
  target_amount: string;
  rate: string;
}

interface SavingsFormProps {
  onSubmit: (data: SavingsFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<SavingsFormData>;
  isEditing?: boolean;
}

export default function SavingsForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}: SavingsFormProps) {
  const [formData, setFormData] = useState<SavingsFormData>({
    name: initialData?.name || '',
    amount: initialData?.amount || '',
    target_amount: initialData?.target_amount || '',
    rate: initialData?.rate || '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Current amount is required';
    } else {
      const amountNum = parseFloat(formData.amount);
      if (isNaN(amountNum)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (amountNum < 0) {
        newErrors.amount = 'Amount cannot be negative';
      }
    }

    // Target Amount validation
    if (!formData.target_amount) {
      newErrors.target_amount = 'Target amount is required';
    } else {
      const targetNum = parseFloat(formData.target_amount);
      if (isNaN(targetNum)) {
        newErrors.target_amount = 'Target must be a valid number';
      } else if (targetNum <= 0) {
        newErrors.target_amount = 'Target must be greater than zero';
      }
    }

    // Interest Rate validation (optional, but if provided must be valid)
    if (formData.rate) {
      const rateNum = parseFloat(formData.rate);
      if (isNaN(rateNum)) {
        newErrors.rate = 'Rate must be a valid number';
      } else if (rateNum < 0) {
        newErrors.rate = 'Rate cannot be negative';
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
          amount: '',
          target_amount: '',
          rate: '0',
        });
      }
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save savings goal'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof SavingsFormData, value: string) => {
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
          label="Goal Name"
          placeholder="e.g., Emergency Fund, Vacation, New Car"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          required
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Current Amount Field */}
      <div>
        <InputField
          type="number"
          label="Current Amount"
          placeholder="0.00"
          value={formData.amount}
          onChange={(value) => updateField('amount', value)}
          required
        />
        {errors.amount && (
          <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Target Amount Field */}
      <div>
        <InputField
          type="number"
          label="Target Amount"
          placeholder="0.00"
          value={formData.target_amount}
          onChange={(value) => updateField('target_amount', value)}
          required
        />
        {errors.target_amount && (
          <p className="text-red-400 text-sm mt-1">{errors.target_amount}</p>
        )}
      </div>

      {/* Interest Rate Field (Optional) */}
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
          Enter the annual interest rate (%) if applicable
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
            className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <div className={onCancel ? 'flex-1' : 'w-full'}>
          <SubmitButton
            isLoading={isSubmitting}
            loadingText={isEditing ? "Updating..." : "Saving..."}
            submitText={isEditing ? "Update Goal" : "Create Goal"}
          />
        </div>
      </div>
    </form>
  );
}
