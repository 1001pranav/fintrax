/**
 * Navigation Type Definitions
 * Type-safe navigation param lists for React Navigation
 */

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
  More: undefined;
};
