/**
 * Authentication API
 * API endpoints for user authentication
 */

import apiClient from './client';
import {
  LoginCredentials,
  RegisterData,
  OTPVerification,
  ResetPasswordData,
  AuthTokens,
  User,
  ApiResponse,
} from '../constants/types';

export const authApi = {
  /**
   * Login user
   */
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/user/login',
      credentials
    );
    return {
      user: response.data.data!.user,
      tokens: { accessToken: response.data.data!.token },
    };
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse>('/user/register', data);
    return { message: response.data.message };
  },

  /**
   * Verify email with OTP
   */
  verifyEmail: async (data: OTPVerification): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse>(
      '/user/verify-email',
      data
    );
    return { message: response.data.message };
  },

  /**
   * Generate OTP for email verification or password reset
   */
  generateOTP: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse>('/user/generate-otp', {
      email,
    });
    return { message: response.data.message };
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse>('/user/forgot-password', {
      email,
    });
    return { message: response.data.message };
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse>(
      '/user/reset-password',
      {
        email: data.email,
        otp: data.otp,
        new_password: data.newPassword,
      }
    );
    return { message: response.data.message };
  },

  /**
   * Logout user (optional - just clear local data)
   */
  logout: async (): Promise<void> => {
    // No server-side logout needed for JWT
    // Just clear local storage
  },
};
