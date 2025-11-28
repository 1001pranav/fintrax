/**
 * Type Definitions
 * Shared interfaces and types for the Fintrax mobile app
 */

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface OTPVerification {
  email: string;
  otp: number;
}

export interface ResetPasswordData {
  email: string;
  otp: number;
  newPassword: string;
}

// ============================================================================
// Task Types
// ============================================================================

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  localId?: string; // For offline operations
  syncStatus?: SyncStatus;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// ============================================================================
// Project Types
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  localId?: string;
  syncStatus?: SyncStatus;
}

// ============================================================================
// Finance Types
// ============================================================================

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  localId?: string;
  syncStatus?: SyncStatus;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Savings {
  id: string;
  goal: number;
  current: number;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  amount: number;
  remaining: number;
  name: string;
  interestRate?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savings: Savings[];
  loans: Loan[];
}

// ============================================================================
// Sync & Offline Types
// ============================================================================

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
  CONFLICT = 'conflict',
}

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  entity: SyncEntity;
  entityId: string;
  payload: any;
  status: SyncStatus;
  retryCount: number;
  createdAt: string;
  lastAttempt?: string;
  error?: string;
}

export enum SyncOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum SyncEntity {
  TASK = 'task',
  PROJECT = 'project',
  TRANSACTION = 'transaction',
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// Navigation Types
// ============================================================================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  VerifyEmail: { email: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Finance: undefined;
  Projects: undefined;
  Settings: undefined;
};

export type TasksStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  CreateTask: { projectId?: string };
};

export type ProjectsStackParamList = {
  ProjectList: undefined;
  ProjectDetail: { projectId: string };
  CreateProject: undefined;
};

export type FinanceStackParamList = {
  FinanceOverview: undefined;
  AddTransaction: undefined;
  TransactionDetail: { transactionId: string };
};

// ============================================================================
// App State Types
// ============================================================================

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
}
