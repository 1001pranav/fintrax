/**
 * API Client
 * Axios instance factory with interceptors for authentication and error handling
 * Implements Factory Pattern for creating configured HTTP client
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { config } from '../constants/config';
import { secureStorage } from '../services/storage';
import NetInfo from '@react-native-community/netinfo';

/**
 * API Client Factory
 * Creates and configures an axios instance with interceptors
 */
class ApiClient {
  private static instance: AxiosInstance;
  private static isRefreshing = false;
  private static failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  /**
   * Create axios instance with default configuration
   */
  private static createInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: config.API_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Configure retry logic for failed requests
    axiosRetry(instance, {
      retries: config.SYNC.MAX_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * 1000; // Exponential backoff
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return (
          axiosRetry.isNetworkError(error) ||
          (error.response?.status ?? 0) >= 500
        );
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
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      // Add auth token if available
      // @ts-expect-error - STORAGE_KEYS exists but type definition is incomplete
      const token = await secureStorage.getSecure(config.STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Response error interceptor - handles token refresh
   */
  private static async responseErrorInterceptor(error: AxiosError) {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const refreshToken = await secureStorage.getSecure(
          config.STORAGE_KEYS.REFRESH_TOKEN
        );

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${config.API_URL}/user/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;

        // Store new token
        await secureStorage.setSecure(
          config.STORAGE_KEYS.AUTH_TOKEN,
          accessToken
        );

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
        await secureStorage.deleteSecure(config.STORAGE_KEYS.AUTH_TOKEN);
        await secureStorage.deleteSecure(config.STORAGE_KEYS.REFRESH_TOKEN);
        await secureStorage.deleteSecure(config.STORAGE_KEYS.USER_DATA);

        // Emit logout event (will be handled by navigation)
        // This is where you'd dispatch a Redux action or emit an event

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    // Extract error message from response
    // @ts-expect-error - API error responses have message/errors but types are incomplete
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unknown error occurred';

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
      this.instance.interceptors.request.use(
        this.requestInterceptor.bind(this),
        (error) => Promise.reject(error)
      );

      // Add response interceptor
      this.instance.interceptors.response.use(
        (response) => response,
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
