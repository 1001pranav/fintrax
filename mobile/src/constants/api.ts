import { EXPO_PUBLIC_API_URL } from '@env';

/**
 * API Configuration Constants
 */

// Base API URL from environment variables
export const API_BASE_URL = EXPO_PUBLIC_API_URL || 'http://172.19.186.29:80/';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/user/register',
    LOGIN: '/user/login',
    VERIFY_EMAIL: '/user/verify-email',
    GENERATE_OTP: '/user/generate-otp',
    FORGOT_PASSWORD: '/user/forgot-password',
    RESET_PASSWORD: '/user/reset-password',
    CHANGE_PASSWORD: '/user/change-password',
    LOGOUT: '/user/logout',
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
    DELETE_ACCOUNT: '/user/delete',
  },

  // Tasks/Todos
  TASKS: {
    BASE: '/todo',
    BY_ID: (id: number) => `/todo/${id}`,
    BY_PROJECT: (projectId: number) => `/todo/project/${projectId}`,
    BY_STATUS: (status: number) => `/todo/status/${status}`,
    BULK_UPDATE: '/todo/bulk-update',
  },

  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: number) => `/projects/${id}`,
    TASKS: (id: number) => `/projects/${id}/tasks`,
    STATISTICS: (id: number) => `/projects/${id}/statistics`,
  },

  // Finance - Transactions
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ID: (id: number) => `/transactions/${id}`,
    BY_TYPE: (type: number) => `/transactions/type/${type}`,
    BY_DATE_RANGE: '/transactions/range',
    SUMMARY: '/transactions/summary',
  },

  // Finance - Savings
  SAVINGS: {
    BASE: '/savings',
    BY_ID: (id: number) => `/savings/${id}`,
  },

  // Finance - Loans
  LOANS: {
    BASE: '/loans',
    BY_ID: (id: number) => `/loans/${id}`,
    PAYMENTS: (id: number) => `/loans/${id}/payments`,
  },

  // Dashboard
  DASHBOARD: {
    SUMMARY: '/dashboard',
    RECENT_TASKS: '/dashboard/recent-tasks',
    RECENT_TRANSACTIONS: '/dashboard/recent-transactions',
  },

  // Roadmaps
  ROADMAPS: {
    BASE: '/roadmaps',
    BY_ID: (id: number) => `/roadmaps/${id}`,
  },

  // Sync
  SYNC: {
    DELTA: '/sync',
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Request Timeout Configuration
 */
export const REQUEST_TIMEOUT = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 60000, // 60 seconds for file uploads
  DOWNLOAD: 120000, // 120 seconds for downloads
} as const;

/**
 * Retry Configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504], // Retry on these status codes
} as const;

/**
 * Content Types
 */
export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;
