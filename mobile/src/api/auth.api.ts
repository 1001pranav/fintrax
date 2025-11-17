import apiClient from './client';
import { API_ENDPOINTS } from '@constants/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  OTPResponse,
  GenerateOTPRequest,
  ForgotPasswordRequest,
  ApiResponse,
} from '@app-types/api.types';

/**
 * Authentication API Module
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * User Login
   * @param credentials - Email and password
   * @returns JWT token and user information
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data!;
  },

  /**
   * User Registration
   * @param userData - Username, email, and password
   * @returns User information and token
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data.data!;
  },

  /**
   * Verify Email with OTP
   * @param data - Email and OTP code
   * @returns Verification status
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<OTPResponse> => {
    const response = await apiClient.post<ApiResponse<OTPResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data
    );
    return response.data.data!;
  },

  /**
   * Generate OTP for email verification or password reset
   * @param data - Email address
   * @returns Success message
   */
  generateOTP: async (data: GenerateOTPRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.GENERATE_OTP,
      data
    );
    return response.data.data!;
  },

  /**
   * Forgot Password - Reset with OTP
   * @param data - Email, OTP, and new password
   * @returns Success message
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data.data!;
  },

  /**
   * Change Password (authenticated user)
   * @param data - Current password and new password
   * @returns Success message
   */
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
    return response.data.data!;
  },

  /**
   * Logout User
   * @returns Success message
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data.data!;
  },

  /**
   * Get User Profile
   * @returns User profile information
   */
  getProfile: async (): Promise<{
    id: number;
    username: string;
    email: string;
    created_at: string;
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        id: number;
        username: string;
        email: string;
        created_at: string;
      }>
    >(API_ENDPOINTS.USER.PROFILE);
    return response.data.data!;
  },

  /**
   * Update User Profile
   * @param data - Updated user information
   * @returns Updated user information
   */
  updateProfile: async (data: {
    username?: string;
    email?: string;
  }): Promise<{
    id: number;
    username: string;
    email: string;
  }> => {
    const response = await apiClient.patch<
      ApiResponse<{
        id: number;
        username: string;
        email: string;
      }>
    >(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
    return response.data.data!;
  },

  /**
   * Delete User Account
   * @returns Success message
   */
  deleteAccount: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.USER.DELETE_ACCOUNT
    );
    return response.data.data!;
  },
};

export default authApi;
