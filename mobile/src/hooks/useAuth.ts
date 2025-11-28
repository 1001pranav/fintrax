/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  login as loginAction,
  register as registerAction,
  verifyEmail as verifyEmailAction,
  forgotPassword as forgotPasswordAction,
  resetPassword as resetPasswordAction,
  logout as logoutAction,
  clearError,
} from '../store/slices/authSlice';
import {
  LoginCredentials,
  RegisterData,
  OTPVerification,
  ResetPasswordData,
} from '../constants/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginAction(credentials));
      return result;
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerAction(data));
      return result;
    },
    [dispatch]
  );

  const verifyEmail = useCallback(
    async (data: OTPVerification) => {
      const result = await dispatch(verifyEmailAction(data));
      return result;
    },
    [dispatch]
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      const result = await dispatch(forgotPasswordAction(email));
      return result;
    },
    [dispatch]
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordData) => {
      const result = await dispatch(resetPasswordAction(data));
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutAction());
    return result;
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    clearError: clearAuthError,
  };
};
