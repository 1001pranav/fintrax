/**
 * API Module Exports
 * Central export point for all API modules
 */

export { default as apiClient, checkNetworkConnectivity, getNetworkInfo } from './client';
export { default as authApi } from './auth.api';
export { default as tasksApi } from './tasks.api';
export { default as financeApi } from './finance.api';
export { default as projectsApi } from './projects.api';
export { default as dashboardApi } from './dashboard.api';

// Re-export types for convenience
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  OTPResponse,
  GenerateOTPRequest,
  ForgotPasswordRequest,
  ApiResponse,
  NetworkError,
} from '@app-types/api.types';

export type {
  Task,
  TaskRequest,
  Project,
  ProjectRequest,
  Transaction,
  TransactionRequest,
  Savings,
  Loan,
  DashboardSummary,
} from '@app-types/models.types';
