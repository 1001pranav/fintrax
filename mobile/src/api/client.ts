import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_CONFIG, HTTP_STATUS } from '@constants/api';
import { tokenStorage } from '@utils/storage';
import { ApiResponse, NetworkError } from '@app-types/api.types';

/**
 * Create Axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * - Adds JWT token to headers
 * - Checks network connectivity
 * - Logs requests in development mode
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check network connectivity
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return Promise.reject({
        message: 'No internet connection. Please check your network and try again.',
        isNetworkError: true,
      } as NetworkError);
    }

    // Add JWT token if available
    try {
      const token = await tokenStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }

    // Log request in development
    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles successful responses
 * - Handles error responses
 * - Triggers logout on 401
 * - Logs responses in development mode
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Clear token
      await tokenStorage.removeToken();

      // Trigger logout (this will be handled by Redux middleware later)
      // For now, we'll just reject the promise
      if (__DEV__) {
        console.log('🔐 Unauthorized - Token cleared');
      }

      return Promise.reject({
        message: 'Your session has expired. Please login again.',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        isNetworkError: false,
      } as NetworkError);
    }

    // Handle network errors
    if (error.message === 'Network Error' || !error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      } as NetworkError);
    }

    // Handle other errors with custom message
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      statusCode: error.response?.status,
      isNetworkError: false,
    } as NetworkError);
  }
);

/**
 * Configure axios-retry for automatic retries
 * - Retries on network errors and specific status codes
 * - Uses exponential backoff
 * - Max 3 retries
 */
axiosRetry(apiClient, {
  retries: RETRY_CONFIG.MAX_RETRIES,
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    const delay = RETRY_CONFIG.RETRY_DELAY * Math.pow(2, retryCount - 1);
    if (__DEV__) {
      console.log(`🔄 Retry attempt ${retryCount} after ${delay}ms`);
    }
    return delay;
  },
  retryCondition: (error: AxiosError) => {
    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on specific status codes (5xx, 429, 408)
    const status = error.response.status;
    return (RETRY_CONFIG.RETRY_STATUS_CODES as readonly number[]).includes(status);
  },
  shouldResetTimeout: true,
  onRetry: (retryCount, error, requestConfig) => {
    if (__DEV__) {
      console.log(`🔄 Retrying request to ${requestConfig.url} (Attempt ${retryCount})`);
    }
  },
});

/**
 * Helper function to check network connectivity
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  const networkState = await NetInfo.fetch();
  return networkState.isConnected ?? false;
};

/**
 * Helper function to get network info
 */
export const getNetworkInfo = async () => {
  const networkState = await NetInfo.fetch();
  return {
    isConnected: networkState.isConnected ?? false,
    isInternetReachable: networkState.isInternetReachable ?? false,
    type: networkState.type,
    details: networkState.details,
  };
};

/**
 * Export the configured API client
 */
export default apiClient;
