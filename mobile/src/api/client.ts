/**
 * API Client
 * Axios instance factory with interceptors for authentication and error handling
 * Implements Factory Pattern for creating configured HTTP client
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { config as appConfig } from '../constants/config';
import { secureStorage } from '../services/storage';
import NetInfo from '@react-native-community/netinfo';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

/**
 * API Error Response Type
 */
interface ApiErrorResponse {
  message?: string;
  errors?: string[];
}

/**
 * API Client Factory
 * Creates and configures an axios instance with interceptors
 */
class ApiClient {
  private static instance: AxiosInstance;
  private static isRefreshing = false;
  private static failedQueue: {
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }[] = [];

  /**
   * Create axios instance with default configuration
   */
  private static createInstance(): AxiosInstance {
    console.log('🌐 API Client Configuration:', {
      baseURL: appConfig.API_URL,
      timeout: appConfig.API_TIMEOUT,
      env: process.env.EXPO_PUBLIC_API_URL,
    });

    const instance = axios.create({
      baseURL: appConfig.API_URL,
      timeout: appConfig.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Configure retry logic for failed requests
    axiosRetry(instance, {
      retries: appConfig.SYNC.MAX_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * 1000; // Exponential backoff
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return axiosRetry.isNetworkError(error) || (error.response?.status ?? 0) >= 500;
      },
    });

    return instance;
  }

  /**
   * Process failed queue after token refresh
   */
  private static processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Request interceptor - adds auth token to requests
   */
  private static async requestInterceptor(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    try {
      console.log('📡 Making request to:', {
        baseURL: config.baseURL,
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        method: config.method,
      });

      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      console.log('📶 Network status:', {
        isConnected: netInfo.isConnected,
        type: netInfo.type,
      });

      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      // Add auth token if available
      const token = await secureStorage.getSecure(appConfig.STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Response error interceptor - handles token refresh
   */
  private static async responseErrorInterceptor(error: AxiosError) {
    console.error('🚨 API Response Error Interceptor');
    console.error('📍 URL:', error.config?.url);
    console.error('📍 Method:', error.config?.method);
    console.error('📍 Status:', error.response?.status);
    console.error('📍 Status Text:', error.response?.statusText);
    console.error('📍 Response Data:', JSON.stringify(error.response?.data, null, 2));

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip token refresh for auth endpoints (login, register, etc.)
    const authEndpoints = [
      '/user/login',
      '/user/register',
      '/user/verify-email',
      '/user/forgot-password',
      '/user/reset-password',
    ];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // Handle 401 Unauthorized - token expired (but not for auth endpoints)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (this.isRefreshing) {
        // Queue this request while token is being refreshed
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        // Try to refresh token
        const refreshToken = await secureStorage.getSecure(appConfig.STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          // Clear auth data and redirect to login
          await secureStorage.deleteSecure(appConfig.STORAGE_KEYS.AUTH_TOKEN);
          await secureStorage.deleteSecure(appConfig.STORAGE_KEYS.REFRESH_TOKEN);
          await secureStorage.deleteSecure(appConfig.STORAGE_KEYS.USER_DATA);

          // Dispatch logout to update Redux state and trigger navigation
          store.dispatch(logout());

          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${appConfig.API_URL}/user/refresh`, { refreshToken });

        const { accessToken } = response.data.data;

        // Store new token
        await secureStorage.setSecure(appConfig.STORAGE_KEYS.AUTH_TOKEN, accessToken);

        // Update Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        this.processQueue(null, accessToken);

        return this.instance(originalRequest);
      } catch (refreshError) {
        this.processQueue(refreshError, null);

        // Clear auth data and redirect to login
        await secureStorage.deleteSecure(appConfig.STORAGE_KEYS.AUTH_TOKEN);
        await secureStorage.deleteSecure(appConfig.STORAGE_KEYS.REFRESH_TOKEN);
        await secureStorage.deleteSecure(appConfig.STORAGE_KEYS.USER_DATA);

        // Dispatch logout to update Redux state and trigger navigation to login screen
        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    // Extract error message from response
    const errorData = error.response?.data as ApiErrorResponse;
    const errorMessage =
      errorData?.message || errorData?.errors?.[0] || error.message || 'An unknown error occurred';

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }

  /**
   * Get configured axios instance (Singleton)
   */
  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = this.createInstance();

      // Add request interceptor
      this.instance.interceptors.request.use(this.requestInterceptor.bind(this), (error) =>
        Promise.reject(error)
      );

      // Add response interceptor
      this.instance.interceptors.response.use(
        (response) => {
          // Log successful responses for debugging
          console.log('✅ API Response Success');
          console.log('📍 URL:', response.config.url);
          console.log('📍 Method:', response.config.method);
          console.log('📍 Status:', response.status);
          console.log('📍 Response Data:', JSON.stringify(response.data, null, 2));
          return response;
        },
        this.responseErrorInterceptor.bind(this)
      );
    }

    return this.instance;
  }

  /**
   * Reset client instance (useful for testing or logout)
   */
  public static reset(): void {
    this.instance = this.createInstance();
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
export default apiClient;
