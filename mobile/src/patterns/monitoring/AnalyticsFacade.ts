/**
 * Facade Pattern - Analytics Facade
 *
 * Provides a unified interface to multiple analytics services.
 * Simplifies tracking events, errors, and user properties across platforms.
 */

import { UserProperties } from '../testing/types';

export class AnalyticsFacade {
  private isInitialized: boolean = false;
  private userId: string | null = null;

  constructor() {
    console.log('[Analytics] Facade created');
  }

  /**
   * Initialize analytics services
   */
  async initialize(config: AnalyticsConfig): Promise<void> {
    try {
      console.log('[Analytics] Initializing analytics services...');

      // Initialize Firebase Analytics
      await this.initializeFirebase(config);

      // Initialize Sentry for error tracking
      await this.initializeSentry(config);

      // Initialize Mixpanel for user analytics (optional)
      if (config.mixpanelToken) {
        await this.initializeMixpanel(config);
      }

      this.isInitialized = true;
      console.log('[Analytics] All analytics services initialized successfully');
    } catch (error) {
      console.error('[Analytics] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Track custom event
   */
  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) {
      console.warn('[Analytics] Services not initialized, skipping event tracking');
      return;
    }

    try {
      console.log(`[Analytics] Tracking event: ${eventName}`, properties);

      // Track in Firebase Analytics
      await this.trackFirebaseEvent(eventName, properties);

      // Track in Mixpanel (if available)
      await this.trackMixpanelEvent(eventName, properties);
    } catch (error) {
      console.error(`[Analytics] Error tracking event ${eventName}:`, error);
    }
  }

  /**
   * Track screen view
   */
  async trackScreen(screenName: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track error
   */
  async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) {
      console.warn('[Analytics] Services not initialized, skipping error tracking');
      return;
    }

    try {
      console.error(`[Analytics] Tracking error:`, error);

      // Send to Sentry
      await this.sendToSentry(error, context);

      // Also track as event in Firebase
      await this.trackEvent('error_occurred', {
        error_message: error.message,
        error_stack: error.stack,
        ...context,
      });
    } catch (err) {
      console.error('[Analytics] Error tracking error:', err);
    }
  }

  /**
   * Set user ID
   */
  async setUserId(userId: string): Promise<void> {
    this.userId = userId;
    console.log(`[Analytics] User ID set: ${userId}`);

    if (!this.isInitialized) return;

    try {
      // Set in Firebase
      // await analytics().setUserId(userId);

      // Set in Sentry
      // Sentry.setUser({ id: userId });

      // Set in Mixpanel
      // mixpanel.identify(userId);
    } catch (error) {
      console.error('[Analytics] Error setting user ID:', error);
    }
  }

  /**
   * Set user properties
   */
  async setUserProperties(properties: UserProperties): Promise<void> {
    if (!this.isInitialized) {
      console.warn('[Analytics] Services not initialized, skipping user properties');
      return;
    }

    try {
      console.log('[Analytics] Setting user properties:', properties);

      // Set in Firebase
      // await analytics().setUserProperties(properties);

      // Set in Sentry
      // Sentry.setUser({ ...properties });

      // Set in Mixpanel
      // mixpanel.people.set(properties);
    } catch (error) {
      console.error('[Analytics] Error setting user properties:', error);
    }
  }

  /**
   * Log out user
   */
  async logoutUser(): Promise<void> {
    this.userId = null;
    console.log('[Analytics] User logged out');

    if (!this.isInitialized) return;

    try {
      // Reset in Firebase
      // await analytics().resetAnalyticsData();

      // Reset in Sentry
      // Sentry.setUser(null);

      // Reset in Mixpanel
      // mixpanel.reset();
    } catch (error) {
      console.error('[Analytics] Error logging out user:', error);
    }
  }

  /**
   * Track performance metric
   */
  async trackPerformance(metricName: string, value: number, unit: string = 'ms'): Promise<void> {
    await this.trackEvent('performance_metric', {
      metric_name: metricName,
      value,
      unit,
    });
  }

  /**
   * Private methods for initializing services
   */
  private async initializeFirebase(config: AnalyticsConfig): Promise<void> {
    console.log('[Analytics] Initializing Firebase Analytics...');
    // In real implementation:
    // import analytics from '@react-native-firebase/analytics';
    // await analytics().setAnalyticsCollectionEnabled(config.enabled);
  }

  private async initializeSentry(config: AnalyticsConfig): Promise<void> {
    console.log('[Analytics] Initializing Sentry...');
    // In real implementation:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.init({
    //   dsn: config.sentryDsn,
    //   environment: config.environment,
    //   enabled: config.enabled,
    // });
  }

  private async initializeMixpanel(config: AnalyticsConfig): Promise<void> {
    console.log('[Analytics] Initializing Mixpanel...');
    // In real implementation:
    // import { Mixpanel } from 'mixpanel-react-native';
    // await Mixpanel.init(config.mixpanelToken);
  }

  private async trackFirebaseEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    // In real implementation:
    // import analytics from '@react-native-firebase/analytics';
    // await analytics().logEvent(eventName, properties);
  }

  private async trackMixpanelEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    // In real implementation:
    // mixpanel.track(eventName, properties);
  }

  private async sendToSentry(error: Error, context?: Record<string, any>): Promise<void> {
    // In real implementation:
    // Sentry.captureException(error, {
    //   extra: context,
    // });
  }
}

export interface AnalyticsConfig {
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  sentryDsn?: string;
  mixpanelToken?: string;
}

/**
 * Singleton instance
 */
let analyticsInstance: AnalyticsFacade | null = null;

export function getAnalytics(): AnalyticsFacade {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsFacade();
  }
  return analyticsInstance;
}

/**
 * Usage:
 *
 * // Initialize
 * const analytics = getAnalytics();
 * await analytics.initialize({
 *   enabled: true,
 *   environment: 'production',
 *   sentryDsn: 'https://xxx@sentry.io/yyy',
 *   mixpanelToken: 'your-token',
 * });
 *
 * // Track events
 * await analytics.trackEvent('user_login', { method: 'email' });
 * await analytics.trackScreen('Dashboard');
 *
 * // Track errors
 * try {
 *   // Some code
 * } catch (error) {
 *   await analytics.trackError(error, { context: 'login_flow' });
 * }
 *
 * // Set user
 * await analytics.setUserId('user-123');
 * await analytics.setUserProperties({ plan: 'premium', email: 'user@example.com' });
 */
