/**
 * Finance Categories
 * Predefined categories for income and expenses with icons and colors
 */

export interface FinanceCategory {
  id: string;
  name: string;
  icon: string; // Ionicons name
  color: string;
  type: 'income' | 'expense';
}

// Income Categories
export const INCOME_CATEGORIES: FinanceCategory[] = [
  {
    id: 'salary',
    name: 'Salary',
    icon: 'briefcase-outline',
    color: '#10B981',
    type: 'income',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'laptop-outline',
    color: '#059669',
    type: 'income',
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: 'trending-up-outline',
    color: '#34D399',
    type: 'income',
  },
  {
    id: 'gift',
    name: 'Gift',
    icon: 'gift-outline',
    color: '#6EE7B7',
    type: 'income',
  },
  {
    id: 'other_income',
    name: 'Other Income',
    icon: 'add-circle-outline',
    color: '#A7F3D0',
    type: 'income',
  },
];

// Expense Categories
export const EXPENSE_CATEGORIES: FinanceCategory[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'restaurant-outline',
    color: '#F59E0B',
    type: 'expense',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'car-outline',
    color: '#3B82F6',
    type: 'expense',
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: 'home-outline',
    color: '#8B5CF6',
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'cart-outline',
    color: '#EC4899',
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'game-controller-outline',
    color: '#F97316',
    type: 'expense',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'medical-outline',
    color: '#14B8A6',
    type: 'expense',
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: 'receipt-outline',
    color: '#EF4444',
    type: 'expense',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'school-outline',
    color: '#6366F1',
    type: 'expense',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: 'basket-outline',
    color: '#84CC16',
    type: 'expense',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: 'fitness-outline',
    color: '#06B6D4',
    type: 'expense',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'airplane-outline',
    color: '#A855F7',
    type: 'expense',
  },
  {
    id: 'other_expense',
    name: 'Other Expense',
    icon: 'ellipsis-horizontal-circle-outline',
    color: '#64748B',
    type: 'expense',
  },
];

// All Categories
export const ALL_CATEGORIES: FinanceCategory[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// Helper Functions
export const getCategoryById = (id: string): FinanceCategory | undefined => {
  return ALL_CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryByName = (name: string): FinanceCategory | undefined => {
  return ALL_CATEGORIES.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
};

export const getCategoriesByType = (type: 'income' | 'expense'): FinanceCategory[] => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};

export const getCategoryColor = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  return category?.color || '#9CA3AF';
};

export const getCategoryIcon = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  return category?.icon || 'ellipse-outline';
};

// Default category for unknown types
export const DEFAULT_INCOME_CATEGORY = INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
export const DEFAULT_EXPENSE_CATEGORY = EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
