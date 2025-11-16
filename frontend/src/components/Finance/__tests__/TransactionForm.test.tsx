/**
 * TransactionForm Component Tests
 * Tests the TransactionForm component's rendering, user interactions, validation, and submission
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionForm, { TransactionFormData } from '../TransactionForm';
import { TRANSACTION_TYPES } from '@/constants/financeConstants';

// Suppress React act() warnings - state updates after form submission are expected
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const maybeMessage = typeof args[0] === 'string' ? args[0] : (args[0] as any)?.message;
    if (
      maybeMessage &&
      maybeMessage.includes('An update to TransactionForm inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('TransactionForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper functions to get form elements
  const getSourceInput = () => screen.getByPlaceholderText(/e\.g\.,/i);
  const getAmountInput = () => screen.getByPlaceholderText(/0\.00/i);
  const getCategorySelect = () => screen.getByRole('combobox');
  const getNotesTextarea = () => screen.getByPlaceholderText(/add any additional notes/i);
  const getIncomeButton = () => screen.getByRole('button', { name: /^income$/i });
  const getExpenseButton = () => screen.getByRole('button', { name: /^expense$/i });
  const getSubmitButton = () => screen.getByRole('button', { name: /add transaction/i });
  const getCancelButton = () => screen.getByRole('button', { name: /cancel/i });

  describe('Initial Rendering', () => {
    it('should render all form fields', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText(/transaction type/i)).toBeInTheDocument();
      expect(getIncomeButton()).toBeInTheDocument();
      expect(getExpenseButton()).toBeInTheDocument();
      expect(screen.getByText(/^source$/i)).toBeInTheDocument();
      expect(screen.getByText(/^amount$/i)).toBeInTheDocument();
      expect(screen.getByText(/^category$/i)).toBeInTheDocument();
      expect(screen.getByText(/^date$/i)).toBeInTheDocument();
      expect(screen.getByText(/^notes$/i)).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
    });

    it('should default to expense transaction type', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      expect(getExpenseButton()).toHaveClass('bg-red-500/20', 'border-red-400');
    });

    it('should render cancel button when onCancel is provided', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(getCancelButton()).toBeInTheDocument();
    });

    it('should not render cancel button when onCancel is not provided', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });

    it('should populate form with initial data when provided', () => {
      const initialData: Partial<TransactionFormData> = {
        source: 'Test Source',
        amount: '100.50',
        type: TRANSACTION_TYPES.INCOME,
        category: 'salary',
        date: '2025-11-15',
        notes: 'Test notes',
      };

      render(<TransactionForm onSubmit={mockOnSubmit} initialData={initialData} />);

      expect(getSourceInput()).toHaveValue('Test Source');
      expect(getAmountInput()).toHaveValue(100.50);
      expect(getCategorySelect()).toHaveValue('salary');
      expect(screen.getByDisplayValue('2025-11-15')).toBeInTheDocument();
      expect(getNotesTextarea()).toHaveValue('Test notes');
      expect(getIncomeButton()).toHaveClass('bg-green-500/20', 'border-green-400');
    });
  });

  describe('Form Field Interactions', () => {
    it('should update source field when user types', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getSourceInput(), 'Walmart');
      expect(getSourceInput()).toHaveValue('Walmart');
    });

    it('should update amount field when user types', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getAmountInput(), '250.75');
      expect(getAmountInput()).toHaveValue(250.75);
    });

    it('should update category when user selects an option', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.selectOptions(getCategorySelect(), 'food');
      expect(getCategorySelect()).toHaveValue('food');
    });

    it('should update date when user changes it', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      const dateInput = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/)[0];
      await user.clear(dateInput);
      await user.type(dateInput, '2025-12-25');
      expect(dateInput).toHaveValue('2025-12-25');
    });

    it('should update notes when user types', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getNotesTextarea(), 'Important transaction');
      expect(getNotesTextarea()).toHaveValue('Important transaction');
    });
  });

  describe('Transaction Type Toggle', () => {
    it('should switch from expense to income when income button is clicked', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Initially expense is selected
      expect(getExpenseButton()).toHaveClass('bg-red-500/20', 'border-red-400');

      // Click income
      await user.click(getIncomeButton());

      expect(getIncomeButton()).toHaveClass('bg-green-500/20', 'border-green-400');
      expect(getExpenseButton()).not.toHaveClass('bg-red-500/20', 'border-red-400');
    });

    it('should switch from income to expense when expense button is clicked', async () => {
      const user = userEvent.setup();
      const initialData: Partial<TransactionFormData> = {
        type: TRANSACTION_TYPES.INCOME,
      };
      render(<TransactionForm onSubmit={mockOnSubmit} initialData={initialData} />);

      // Initially income is selected
      expect(getIncomeButton()).toHaveClass('bg-green-500/20', 'border-green-400');

      // Click expense
      await user.click(getExpenseButton());

      expect(getExpenseButton()).toHaveClass('bg-red-500/20', 'border-red-400');
      expect(getIncomeButton()).not.toHaveClass('bg-green-500/20', 'border-green-400');
    });

    it('should reset category when switching transaction type', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Select an expense category
      await user.selectOptions(getCategorySelect(), 'food');
      expect(getCategorySelect()).toHaveValue('food');

      // Switch to income
      await user.click(getIncomeButton());

      // Category should be reset
      expect(getCategorySelect()).toHaveValue('');
    });

    it('should show income categories when income type is selected', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.click(getIncomeButton());

      // Check for income categories
      expect(screen.getByRole('option', { name: /salary/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /freelance/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /investment/i })).toBeInTheDocument();
    });

    it('should show expense categories when expense type is selected', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Check for expense categories
      expect(screen.getByRole('option', { name: /food/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /transport/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /entertainment/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    // Note: The form uses HTML5 required attributes which provide initial validation.
    // Our custom validation tests focus on edge cases that HTML5 doesn't catch.

    it('should validate that source cannot be only whitespace', async () => {
      const user = userEvent.setup();
      const { container } = render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill fields with whitespace for source (passes HTML5 but fails custom validation)
      await user.type(getSourceInput(), '   ');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      // Submit the form programmatically to bypass HTML5 validation
      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText(/source is required/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate amount as greater than zero', async () => {
      const user = userEvent.setup();
      const { container } = render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getSourceInput(), 'Test Source');
      await user.type(getAmountInput(), '0');
      await user.selectOptions(getCategorySelect(), 'food');

      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than zero/i)).toBeInTheDocument();
      });
    });

    it('should validate negative amounts', async () => {
      const user = userEvent.setup();
      const { container } = render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getSourceInput(), 'Test Source');
      await user.type(getAmountInput(), '-50');
      await user.selectOptions(getCategorySelect(), 'food');

      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than zero/i)).toBeInTheDocument();
      });
    });

    it('should clear field error when user updates the field', async () => {
      const user = userEvent.setup();
      const { container } = render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill with invalid data (whitespace)
      await user.type(getSourceInput(), '   ');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      // Submit to trigger errors
      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/source is required/i)).toBeInTheDocument();
      });

      // Clear and type valid value in source field
      await user.clear(getSourceInput());
      await user.type(getSourceInput(), 'Test');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/source is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data when validation passes', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill form
      await user.type(getSourceInput(), 'Grocery Store');
      await user.type(getAmountInput(), '75.50');
      await user.selectOptions(getCategorySelect(), 'food');
      await user.type(getNotesTextarea(), 'Weekly shopping');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.source).toBe('Grocery Store');
      expect(submittedData.amount).toBe('75.5'); // Number inputs trim trailing zeros
      expect(submittedData.type).toBe(TRANSACTION_TYPES.EXPENSE);
      expect(submittedData.category).toBe('food');
      expect(submittedData.notes).toBe('Weekly shopping');
      expect(submittedData.date).toBeTruthy();

      // Wait for all form state updates to complete (button re-enabled = isSubmitting set to false)
      await waitFor(() => {
        expect((getSubmitButton() as HTMLButtonElement).disabled).toBe(false);
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill form
      await user.type(getSourceInput(), 'Test');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      await user.click(getSubmitButton());

      // Should show loading text
      await waitFor(() => {
        expect(screen.getByText(/saving/i)).toBeInTheDocument();
      });

      // Resolve promise
      resolveSubmit!();

      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill form
      await user.type(getSourceInput(), 'Test Source');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');
      await user.type(getNotesTextarea(), 'Test notes');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      // Form should be reset
      await waitFor(() => {
        expect(getSourceInput()).toHaveValue('');
        expect(getAmountInput()).toHaveValue(null);
        expect(getCategorySelect()).toHaveValue('');
        expect(getNotesTextarea()).toHaveValue('');
      });
    });

    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Network error'));

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill form
      await user.type(getSourceInput(), 'Test');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should handle generic error when error is not an Error instance', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue('Something went wrong');

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill form
      await user.type(getSourceInput(), 'Test');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText(/failed to create transaction/i)).toBeInTheDocument();
      });
    });

    it('should disable buttons during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      // Fill form
      await user.type(getSourceInput(), 'Test');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      await user.click(getSubmitButton());

      // Buttons should be disabled during submission
      await waitFor(() => {
        expect(getCancelButton()).toBeDisabled();
      });

      // Resolve promise
      resolveSubmit!();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.click(getCancelButton());
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should not reset form when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(getSourceInput(), 'Test Source');
      await user.click(getCancelButton());

      // Form should still have the value
      expect(getSourceInput()).toHaveValue('Test Source');
    });
  });

  describe('Edge Cases', () => {
    it('should handle decimal amounts correctly', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getSourceInput(), 'Test');
      await user.type(getAmountInput(), '99.99');
      await user.selectOptions(getCategorySelect(), 'food');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      expect(mockOnSubmit.mock.calls[0][0].amount).toBe('99.99');

      // Wait for all form state updates to complete (button re-enabled = isSubmitting set to false)
      await waitFor(() => {
        expect((getSubmitButton() as HTMLButtonElement).disabled).toBe(false);
      });
    });

    it('should handle very large amounts', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      await user.type(getSourceInput(), 'Test');
      await user.type(getAmountInput(), '1000000');
      await user.selectOptions(getCategorySelect(), 'food');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      expect(mockOnSubmit.mock.calls[0][0].amount).toBe('1000000');

      // Wait for all form state updates to complete (button re-enabled = isSubmitting set to false)
      await waitFor(() => {
        expect((getSubmitButton() as HTMLButtonElement).disabled).toBe(false);
      });
    });

    it('should preserve notes field through validation errors', async () => {
      const user = userEvent.setup();
      const { container } = render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Fill with invalid data
      await user.type(getSourceInput(), '   '); // Whitespace only
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');
      await user.type(getNotesTextarea(), 'Important notes');

      // Submit with validation error
      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/source is required/i)).toBeInTheDocument();
      });

      // Notes should still be there
      expect(getNotesTextarea()).toHaveValue('Important notes');
    });

    it('should work without initial data', () => {
      render(<TransactionForm onSubmit={mockOnSubmit} />);

      expect(getSourceInput()).toHaveValue('');
      expect(getAmountInput()).toHaveValue(null);
      expect(getCategorySelect()).toHaveValue('');
      expect(getNotesTextarea()).toHaveValue('');
    });

    it('should work with partial initial data', () => {
      const initialData: Partial<TransactionFormData> = {
        source: 'Partial Source',
        amount: '50',
      };

      render(<TransactionForm onSubmit={mockOnSubmit} initialData={initialData} />);

      expect(getSourceInput()).toHaveValue('Partial Source');
      expect(getAmountInput()).toHaveValue(50);
      expect(getCategorySelect()).toHaveValue('');
      expect(getNotesTextarea()).toHaveValue('');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle a complete expense transaction', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // User fills out an expense
      await user.type(getSourceInput(), 'Whole Foods Market');
      await user.type(getAmountInput(), '87.42');
      await user.selectOptions(getCategorySelect(), 'food');
      await user.type(getNotesTextarea(), 'Weekly groceries');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            source: 'Whole Foods Market',
            amount: '87.42',
            type: TRANSACTION_TYPES.EXPENSE,
            category: 'food',
            notes: 'Weekly groceries',
          })
        );
      });

      // Wait for all form state updates to complete (button re-enabled = isSubmitting set to false)
      await waitFor(() => {
        expect((getSubmitButton() as HTMLButtonElement).disabled).toBe(false);
      });
    });

    it('should handle a complete income transaction', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Switch to income
      await user.click(getIncomeButton());

      // Fill income transaction
      await user.type(getSourceInput(), 'Acme Corp - Salary');
      await user.type(getAmountInput(), '5000');
      await user.selectOptions(getCategorySelect(), 'salary');
      await user.type(getNotesTextarea(), 'November salary');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            source: 'Acme Corp - Salary',
            amount: '5000',
            type: TRANSACTION_TYPES.INCOME,
            category: 'salary',
            notes: 'November salary',
          })
        );
      });

      // Wait for all form state updates to complete (button re-enabled = isSubmitting set to false)
      await waitFor(() => {
        expect((getSubmitButton() as HTMLButtonElement).disabled).toBe(false);
      });
    });

    it('should handle switching between income and expense while filling form', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TransactionForm onSubmit={mockOnSubmit} />);

      // Start with expense
      await user.type(getSourceInput(), 'Test Source');
      await user.type(getAmountInput(), '100');
      await user.selectOptions(getCategorySelect(), 'food');

      // Switch to income
      await user.click(getIncomeButton());

      // Category should be reset, need to select new one
      await user.selectOptions(getCategorySelect(), 'salary');

      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            type: TRANSACTION_TYPES.INCOME,
            category: 'salary',
          })
        );
      });

      // Wait for all form state updates to complete (button re-enabled = isSubmitting set to false)
      await waitFor(() => {
        expect((getSubmitButton() as HTMLButtonElement).disabled).toBe(false);
      });
    });
  });
});
