/**
 * Data Model Type Definitions
 */

/**
 * Task/Todo Model
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: number; // 1-5 (1=highest, 5=lowest)
  status: number; // 1=To Do, 2=In Progress, 6=Completed, 5=Deleted
  due_days?: number;
  start_date?: string;
  end_date?: string;
  project_id?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  is_synced?: boolean; // For offline sync
}

/**
 * Task Create/Update Request
 */
export interface TaskRequest {
  title: string;
  description?: string;
  priority?: number;
  status?: number;
  due_days?: number;
  start_date?: string;
  end_date?: string;
  project_id?: number;
}

/**
 * Project Model
 */
export interface Project {
  id: number;
  name: string;
  description?: string;
  color?: string;
  status: number; // 1=Active, 2=Completed, 3=Archived
  user_id: number;
  created_at: string;
  updated_at: string;
  task_count?: number;
  completed_task_count?: number;
}

/**
 * Project Create/Update Request
 */
export interface ProjectRequest {
  name: string;
  description?: string;
  color?: string;
  status?: number;
}

/**
 * Transaction Model
 */
export interface Transaction {
  id: number;
  source: string; // Description/merchant name
  amount: number;
  type: number; // 1=Income, 2=Expense
  category?: string;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  is_synced?: boolean; // For offline sync
}

/**
 * Transaction Create/Update Request
 */
export interface TransactionRequest {
  source: string;
  amount: number;
  type: number;
  category?: string;
  date?: string;
}

/**
 * Savings Model
 */
export interface Savings {
  id: number;
  name: string;
  amount: number;
  interest_rate?: number;
  target_amount?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Loan Model
 */
export interface Loan {
  id: number;
  name: string;
  principal_amount: number;
  interest_rate: number;
  emi_amount?: number;
  remaining_balance?: number;
  start_date?: string;
  end_date?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Dashboard Summary
 */
export interface DashboardSummary {
  total_balance?: number;
  net_worth?: number;
  total_income?: number;
  total_expenses?: number;
  pending_tasks?: number;
  completed_tasks?: number;
  active_projects?: number;
  recent_tasks?: Task[];
  recent_transactions?: Transaction[];
}

/**
 * Task Statistics
 */
export interface TaskStatistics {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  by_priority: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Financial Summary
 */
export interface FinancialSummary {
  total_balance: number;
  income_this_month: number;
  expenses_this_month: number;
  net_this_month: number;
  savings_total: number;
  loans_total: number;
}
