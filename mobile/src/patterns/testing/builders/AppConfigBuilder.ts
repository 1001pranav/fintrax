/**
 * Builder Pattern - App Configuration Builder
 *
 * Provides a flexible way to build app configuration objects
 * for different environments (development, staging, production).
 */

import { AppConfig, FeatureFlags } from '../types';

export interface IAppConfigBuilder {
  setEnvironment(env: 'development' | 'staging' | 'production'): IAppConfigBuilder;
  setApiUrl(url: string): IAppConfigBuilder;
  setDebugMode(enabled: boolean): IAppConfigBuilder;
  setAnalyticsEnabled(enabled: boolean): IAppConfigBuilder;
  setCrashReportingEnabled(enabled: boolean): IAppConfigBuilder;
  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): IAppConfigBuilder;
  setFeatureFlags(flags: FeatureFlags): IAppConfigBuilder;
  setTimeoutMs(timeout: number): IAppConfigBuilder;
  setMaxRetries(retries: number): IAppConfigBuilder;
  build(): AppConfig;
}

export class AppConfigBuilder implements IAppConfigBuilder {
  private config: Partial<AppConfig> = {
    environment: 'development',
    debugMode: true,
    analyticsEnabled: false,
    crashReportingEnabled: false,
    logLevel: 'debug',
    timeoutMs: 30000,
    maxRetries: 3,
  };

  setEnvironment(env: 'development' | 'staging' | 'production'): IAppConfigBuilder {
    this.config.environment = env;

    // Set sensible defaults based on environment
    if (env === 'production') {
      this.config.debugMode = false;
      this.config.analyticsEnabled = true;
      this.config.crashReportingEnabled = true;
      this.config.logLevel = 'error';
    } else if (env === 'staging') {
      this.config.debugMode = true;
      this.config.analyticsEnabled = true;
      this.config.crashReportingEnabled = true;
      this.config.logLevel = 'info';
    } else {
      this.config.debugMode = true;
      this.config.analyticsEnabled = false;
      this.config.crashReportingEnabled = false;
      this.config.logLevel = 'debug';
    }

    return this;
  }

  setApiUrl(url: string): IAppConfigBuilder {
    this.config.apiUrl = url;
    return this;
  }

  setDebugMode(enabled: boolean): IAppConfigBuilder {
    this.config.debugMode = enabled;
    return this;
  }

  setAnalyticsEnabled(enabled: boolean): IAppConfigBuilder {
    this.config.analyticsEnabled = enabled;
    return this;
  }

  setCrashReportingEnabled(enabled: boolean): IAppConfigBuilder {
    this.config.crashReportingEnabled = enabled;
    return this;
  }

  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): IAppConfigBuilder {
    this.config.logLevel = level;
    return this;
  }

  setFeatureFlags(flags: FeatureFlags): IAppConfigBuilder {
    this.config.featureFlags = flags;
    return this;
  }

  setTimeoutMs(timeout: number): IAppConfigBuilder {
    this.config.timeoutMs = timeout;
    return this;
  }

  setMaxRetries(retries: number): IAppConfigBuilder {
    this.config.maxRetries = retries;
    return this;
  }

  build(): AppConfig {
    if (!this.config.apiUrl) {
      throw new Error('API URL is required');
    }

    return this.config as AppConfig;
  }

  reset(): IAppConfigBuilder {
    this.config = {
      environment: 'development',
      debugMode: true,
      analyticsEnabled: false,
      crashReportingEnabled: false,
      logLevel: 'debug',
      timeoutMs: 30000,
      maxRetries: 3,
    };
    return this;
  }
}

/**
 * Usage examples:
 *
 * // Development config
 * const devConfig = new AppConfigBuilder()
 *   .setEnvironment('development')
 *   .setApiUrl('http://localhost:80/api')
 *   .build();
 *
 * // Production config
 * const prodConfig = new AppConfigBuilder()
 *   .setEnvironment('production')
 *   .setApiUrl('https://api.fintrax.com')
 *   .setFeatureFlags({ offlineMode: true, biometrics: true })
 *   .build();
 */
