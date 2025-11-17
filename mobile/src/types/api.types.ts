/**
 * API Request and Response Type Definitions
 */

/**
 * Base API Response Structure
 */
export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  errors?: ApiError[];
}

/**
 * API Error Structure
 */
export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Authentication Responses
 */
export interface LoginResponse {
  token: string;
  user_id: number;
  email: string;
  username: string;
}

export interface RegisterResponse {
  token: string;
  user_id: number;
  email: string;
  username: string;
  otp_sent: boolean;
}

export interface OTPResponse {
  message: string;
  verified: boolean;
}

/**
 * Authentication Requests
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface GenerateOTPRequest {
  email: string;
}

/**
 * Network Error Response
 */
export interface NetworkError {
  message: string;
  isNetworkError: boolean;
  statusCode?: number;
}
