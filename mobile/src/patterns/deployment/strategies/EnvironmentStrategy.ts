/**
 * Strategy Pattern - Environment Configuration Strategy
 *
 * Defines different environment configurations (development, staging, production).
 * Allows switching between environments at runtime.
 */

import { AppConfig } from '../../testing/types';

export interface IEnvironmentStrategy {
  getConfig(): AppConfig;
  getName(): string;
  getDescription(): string;
}

export class DevelopmentEnvironment implements IEnvironmentStrategy {
  getConfig(): AppConfig {
    return {
      environment: 'development',
      apiUrl: 'http://localhost:80/api',
      debugMode: true,
      analyticsEnabled: false,
      crashReportingEnabled: false,
      logLevel: 'debug',
      featureFlags: {
        offlineMode: true,
        biometrics: true,
        darkMode: true,
        notifications: true,
        betaFeatures: true, // Enable all beta features in dev
      },
      timeoutMs: 30000,
      maxRetries: 3,
    };
  }

  getName(): string {
    return 'development';
  }

  getDescription(): string {
    return 'Local development environment with all features enabled';
  }
}

export class StagingEnvironment implements IEnvironmentStrategy {
  getConfig(): AppConfig {
    return {
      environment: 'staging',
      apiUrl: 'https://staging-api.fintrax.com',
      debugMode: true,
      analyticsEnabled: true,
      crashReportingEnabled: true,
      logLevel: 'info',
      featureFlags: {
        offlineMode: true,
        biometrics: true,
        darkMode: true,
        notifications: true,
        betaFeatures: true, // Test beta features in staging
      },
      timeoutMs: 30000,
      maxRetries: 3,
    };
  }

  getName(): string {
    return 'staging';
  }

  getDescription(): string {
    return 'Staging environment for pre-production testing';
  }
}

export class ProductionEnvironment implements IEnvironmentStrategy {
  getConfig(): AppConfig {
    return {
      environment: 'production',
      apiUrl: 'https://api.fintrax.com',
      debugMode: false,
      analyticsEnabled: true,
      crashReportingEnabled: true,
      logLevel: 'error',
      featureFlags: {
        offlineMode: true,
        biometrics: true,
        darkMode: true,
        notifications: true,
        betaFeatures: false, // Disable beta features in production
      },
      timeoutMs: 30000,
      maxRetries: 3,
    };
  }

  getName(): string {
    return 'production';
  }

  getDescription(): string {
    return 'Production environment for end users';
  }
}

/**
 * Environment Manager
 */
export class EnvironmentManager {
  private strategy: IEnvironmentStrategy;

  constructor(environment?: 'development' | 'staging' | 'production') {
    this.strategy = this.createStrategy(environment || 'development');
  }

  setEnvironment(environment: 'development' | 'staging' | 'production'): void {
    this.strategy = this.createStrategy(environment);
    console.log(`[Environment] Switched to ${this.strategy.getName()} environment`);
  }

  getConfig(): AppConfig {
    return this.strategy.getConfig();
  }

  getEnvironmentName(): string {
    return this.strategy.getName();
  }

  getEnvironmentDescription(): string {
    return this.strategy.getDescription();
  }

  isProduction(): boolean {
    return this.strategy.getName() === 'production';
  }

  isDevelopment(): boolean {
    return this.strategy.getName() === 'development';
  }

  isStaging(): boolean {
    return this.strategy.getName() === 'staging';
  }

  private createStrategy(
    environment: 'development' | 'staging' | 'production'
  ): IEnvironmentStrategy {
    switch (environment) {
      case 'development':
        return new DevelopmentEnvironment();
      case 'staging':
        return new StagingEnvironment();
      case 'production':
        return new ProductionEnvironment();
      default:
        return new DevelopmentEnvironment();
    }
  }
}

/**
 * Usage:
 *
 * // Create environment manager
 * const envManager = new EnvironmentManager('production');
 *
 * // Get configuration
 * const config = envManager.getConfig();
 * console.log(`API URL: ${config.apiUrl}`);
 * console.log(`Debug mode: ${config.debugMode}`);
 *
 * // Switch environment
 * envManager.setEnvironment('staging');
 *
 * // Check environment
 * if (envManager.isProduction()) {
 *   // Production-specific logic
 * }
 */
