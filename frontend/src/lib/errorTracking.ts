/**
 * Error Tracking Service
 *
 * Centralized error tracking for the Fintrax application.
 * Supports Sentry and console logging for development.
 *
 * Usage:
 * - import { captureError, captureMessage, setUser } from '@/lib/errorTracking'
 * - captureError(new Error('Something went wrong'), { context: 'additional info' })
 */

interface ErrorContext {
  [key: string]: any;
}

interface User {
  id: string;
  email?: string;
  username?: string;
}

class ErrorTracker {
  private enabled: boolean;
  private environment: string;
  private userId?: string;

  constructor() {
    this.enabled = process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true';
    this.environment = process.env.NODE_ENV || 'development';
  }

  /**
   * Initialize error tracking service
   * In production, this would initialize Sentry or similar service
   */
  init() {
    if (!this.enabled) {
      console.log('[ErrorTracking] Error tracking disabled');
      return;
    }

    // In production, initialize Sentry here:
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.init({
    //     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //     environment: this.environment,
    //     tracesSampleRate: 0.1,
    //   });
    // }

    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    console.log('[ErrorTracking] Error tracking initialized');
  }

  /**
   * Handle global errors
   */
  private handleGlobalError(event: ErrorEvent) {
    this.captureError(event.error, {
      type: 'global_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.captureError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
      type: 'unhandled_rejection',
      reason: event.reason,
    });
  }

  /**
   * Capture an error with optional context
   */
  captureError(error: Error, context?: ErrorContext) {
    if (!this.enabled) {
      console.error('[ErrorTracking]', error, context);
      return;
    }

    // In development, log to console
    if (this.environment === 'development') {
      console.error('[ErrorTracking] Error captured:', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      });
    }

    // In production, send to Sentry:
    // Sentry.captureException(error, {
    //   contexts: { custom: context },
    //   user: this.userId ? { id: this.userId } : undefined,
    // });
  }

  /**
   * Capture a message with optional context
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (!this.enabled) {
      console.log('[ErrorTracking]', level, message, context);
      return;
    }

    // In development, log to console
    if (this.environment === 'development') {
      const logFn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
      logFn('[ErrorTracking] Message captured:', {
        message,
        level,
        context,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      });
    }

    // In production, send to Sentry:
    // Sentry.captureMessage(message, {
    //   level,
    //   contexts: { custom: context },
    //   user: this.userId ? { id: this.userId } : undefined,
    // });
  }

  /**
   * Set the current user context
   */
  setUser(user: User | null) {
    if (!user) {
      this.userId = undefined;
      // Sentry.setUser(null);
      return;
    }

    this.userId = user.id;

    // In production, set Sentry user:
    // Sentry.setUser({
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    // });

    if (this.environment === 'development') {
      console.log('[ErrorTracking] User set:', { id: user.id, email: user.email });
    }
  }

  /**
   * Set custom context for errors
   */
  setContext(key: string, value: any) {
    if (!this.enabled) return;

    // In production, set Sentry context:
    // Sentry.setContext(key, value);

    if (this.environment === 'development') {
      console.log('[ErrorTracking] Context set:', { key, value });
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category?: string, data?: any) {
    if (!this.enabled) return;

    // In production, add Sentry breadcrumb:
    // Sentry.addBreadcrumb({
    //   message,
    //   category,
    //   data,
    //   timestamp: Date.now() / 1000,
    // });

    if (this.environment === 'development') {
      console.log('[ErrorTracking] Breadcrumb:', { message, category, data });
    }
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

// Export convenience functions
export const initErrorTracking = () => errorTracker.init();
export const captureError = (error: Error, context?: ErrorContext) => errorTracker.captureError(error, context);
export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext) =>
  errorTracker.captureMessage(message, level, context);
export const setUser = (user: User | null) => errorTracker.setUser(user);
export const setContext = (key: string, value: any) => errorTracker.setContext(key, value);
export const addBreadcrumb = (message: string, category?: string, data?: any) =>
  errorTracker.addBreadcrumb(message, category, data);

// Error boundary helper
export class ErrorBoundary {
  static handleError(error: Error, errorInfo: any) {
    captureError(error, {
      componentStack: errorInfo.componentStack,
      type: 'react_error_boundary',
    });
  }
}

export default errorTracker;
