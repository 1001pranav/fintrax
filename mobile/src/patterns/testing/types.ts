/**
 * Type definitions for testing patterns
 */

export interface Test {
  id: string;
  name: string;
  description: string;
  data: TestData;
  expectation: TestExpectation;
  tags: string[];
  timeout: number;
  retries: number;
  createdAt: string;
}

export interface TestData {
  [key: string]: any;
}

export interface TestExpectation {
  [key: string]: any;
}

export interface TestConfig {
  parallel?: boolean;
  failFast?: boolean;
  retries?: number;
  timeout?: number;
  tags?: string[];
}

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  errors: string[];
  timestamp?: string;
  attempts?: number;
}

export interface TestReport {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  coverage?: number;
  results: TestResult[];
  timestamp: string;
}

export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  debugMode: boolean;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  featureFlags?: FeatureFlags;
  timeoutMs: number;
  maxRetries: number;
}

export interface FeatureFlags {
  offlineMode?: boolean;
  biometrics?: boolean;
  darkMode?: boolean;
  notifications?: boolean;
  betaFeatures?: boolean;
}

export interface Bug {
  id: string;
  type: 'crash' | 'data_loss' | 'security' | 'performance' | 'ui' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export type BugPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface CrashReport {
  id: string;
  message: string;
  stackTrace: string;
  platform: 'ios' | 'android';
  appVersion: string;
  osVersion: string;
  device: string;
  timestamp: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: BugPriority;
}

export interface Feedback {
  id: string;
  userId?: string;
  category: 'bug' | 'feature_request' | 'ux_improvement' | 'other';
  title: string;
  description: string;
  rating?: number;
  screenshot?: string;
  deviceInfo: {
    platform: 'ios' | 'android';
    version: string;
    model: string;
  };
  timestamp: string;
  status: 'new' | 'reviewed' | 'resolved' | 'wont_fix';
}

export interface DeploymentResult {
  success: boolean;
  status: string;
  message?: string;
  timestamp: string;
}

export interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  plan?: string;
  [key: string]: any;
}
