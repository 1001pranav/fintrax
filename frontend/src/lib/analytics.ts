/**
 * Analytics Service
 *
 * Centralized analytics tracking for the Fintrax application.
 * Supports PostHog, Plausible, or custom analytics implementation.
 *
 * Privacy-first approach: No personal data tracking without consent.
 *
 * Usage:
 * - import { trackEvent, trackPageView, setUserProperties } from '@/lib/analytics'
 * - trackEvent('task_created', { priority: 'high', project_id: '123' })
 */

interface EventProperties {
  [key: string]: any;
}

interface UserProperties {
  userId?: string;
  email?: string;
  plan?: string;
  signupDate?: string;
  [key: string]: any;
}

interface PageViewProperties {
  path: string;
  title?: string;
  referrer?: string;
  [key: string]: any;
}

class Analytics {
  private enabled: boolean;
  private environment: string;
  private userId?: string;
  private consentGiven: boolean = false;

  constructor() {
    this.enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    this.environment = process.env.NODE_ENV || 'development';

    // Check for stored consent (for privacy compliance)
    if (typeof window !== 'undefined') {
      this.consentGiven = localStorage.getItem('analytics_consent') === 'true';
    }
  }

  /**
   * Initialize analytics service
   */
  init() {
    if (!this.enabled || !this.consentGiven) {
      console.log('[Analytics] Analytics disabled or consent not given');
      return;
    }

    // In production with PostHog:
    // if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    //   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    //     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    //     loaded: (posthog) => {
    //       if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing();
    //     },
    //   });
    // }

    // For Plausible:
    // Load Plausible script in _document.tsx or layout.tsx

    console.log('[Analytics] Analytics initialized');
  }

  /**
   * Request user consent for analytics (GDPR compliance)
   */
  requestConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      // In production, show a consent banner
      // For now, assume consent is given in development
      if (this.environment === 'development') {
        this.consentGiven = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('analytics_consent', 'true');
        }
        resolve(true);
      } else {
        // In production, implement proper consent UI
        resolve(false);
      }
    });
  }

  /**
   * Grant analytics consent
   */
  grantConsent() {
    this.consentGiven = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_consent', 'true');
    }
    this.init();
  }

  /**
   * Revoke analytics consent
   */
  revokeConsent() {
    this.consentGiven = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_consent');
    }
    // Clear user data
    this.userId = undefined;
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, properties?: EventProperties) {
    if (!this.enabled || !this.consentGiven) {
      if (this.environment === 'development') {
        console.log('[Analytics] Event:', eventName, properties);
      }
      return;
    }

    // In development, log to console
    if (this.environment === 'development') {
      console.log('[Analytics] Event tracked:', {
        event: eventName,
        properties,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      });
    }

    // In production with PostHog:
    // posthog.capture(eventName, properties);

    // With Plausible (custom events):
    // if (typeof window !== 'undefined' && (window as any).plausible) {
    //   (window as any).plausible(eventName, { props: properties });
    // }
  }

  /**
   * Track a page view
   */
  trackPageView(properties?: PageViewProperties) {
    if (!this.enabled || !this.consentGiven) return;

    const pageData = {
      path: properties?.path || (typeof window !== 'undefined' ? window.location.pathname : ''),
      title: properties?.title || (typeof document !== 'undefined' ? document.title : ''),
      referrer: properties?.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
      ...properties,
    };

    // In development, log to console
    if (this.environment === 'development') {
      console.log('[Analytics] Page view:', pageData);
    }

    // With PostHog:
    // posthog.capture('$pageview', pageData);

    // Plausible automatically tracks page views
  }

  /**
   * Identify user with properties
   */
  identifyUser(userId: string, properties?: UserProperties) {
    if (!this.enabled || !this.consentGiven) return;

    this.userId = userId;

    // In development, log to console
    if (this.environment === 'development') {
      console.log('[Analytics] User identified:', { userId, properties });
    }

    // With PostHog:
    // posthog.identify(userId, properties);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties) {
    if (!this.enabled || !this.consentGiven) return;

    // In development, log to console
    if (this.environment === 'development') {
      console.log('[Analytics] User properties set:', properties);
    }

    // With PostHog:
    // posthog.people.set(properties);
  }

  /**
   * Reset user identity (e.g., on logout)
   */
  resetUser() {
    this.userId = undefined;

    if (!this.enabled || !this.consentGiven) return;

    // With PostHog:
    // posthog.reset();
  }

  /**
   * Track timing events (e.g., API response time, page load time)
   */
  trackTiming(category: string, variable: string, timeMs: number, label?: string) {
    if (!this.enabled || !this.consentGiven) return;

    this.trackEvent('timing', {
      category,
      variable,
      time_ms: timeMs,
      label,
    });
  }
}

// Create singleton instance
const analytics = new Analytics();

// Export convenience functions
export const initAnalytics = () => analytics.init();
export const requestConsent = () => analytics.requestConsent();
export const grantConsent = () => analytics.grantConsent();
export const revokeConsent = () => analytics.revokeConsent();
export const trackEvent = (eventName: string, properties?: EventProperties) => analytics.trackEvent(eventName, properties);
export const trackPageView = (properties?: PageViewProperties) => analytics.trackPageView(properties);
export const identifyUser = (userId: string, properties?: UserProperties) => analytics.identifyUser(userId, properties);
export const setUserProperties = (properties: UserProperties) => analytics.setUserProperties(properties);
export const resetUser = () => analytics.resetUser();
export const trackTiming = (category: string, variable: string, timeMs: number, label?: string) =>
  analytics.trackTiming(category, variable, timeMs, label);

// Common event tracking helpers
export const trackUserAction = {
  // Authentication
  login: () => trackEvent('user_login'),
  logout: () => trackEvent('user_logout'),
  register: () => trackEvent('user_register'),

  // Tasks
  createTask: (projectId?: string) => trackEvent('task_created', { project_id: projectId }),
  updateTask: (taskId: string) => trackEvent('task_updated', { task_id: taskId }),
  deleteTask: (taskId: string) => trackEvent('task_deleted', { task_id: taskId }),
  completeTask: (taskId: string) => trackEvent('task_completed', { task_id: taskId }),

  // Projects
  createProject: () => trackEvent('project_created'),
  updateProject: (projectId: string) => trackEvent('project_updated', { project_id: projectId }),
  deleteProject: (projectId: string) => trackEvent('project_deleted', { project_id: projectId }),

  // Finance
  createTransaction: (type: string) => trackEvent('transaction_created', { type }),
  updateTransaction: (transactionId: string) => trackEvent('transaction_updated', { transaction_id: transactionId }),
  deleteTransaction: (transactionId: string) => trackEvent('transaction_deleted', { transaction_id: transactionId }),

  createSaving: () => trackEvent('saving_created'),
  createLoan: () => trackEvent('loan_created'),

  // Roadmaps
  createRoadmap: () => trackEvent('roadmap_created'),
  updateRoadmap: (roadmapId: string) => trackEvent('roadmap_updated', { roadmap_id: roadmapId }),

  // Engagement
  viewDashboard: () => trackEvent('dashboard_viewed'),
  viewFinance: () => trackEvent('finance_viewed'),
  viewProjects: () => trackEvent('projects_viewed'),
  viewRoadmaps: () => trackEvent('roadmaps_viewed'),

  // Features
  exportData: (format: string) => trackEvent('data_exported', { format }),
  importData: (format: string) => trackEvent('data_imported', { format }),
  provideFeedback: () => trackEvent('feedback_provided'),
};

export default analytics;
