/**
 * Security Utilities
 *
 * Security helpers and validation functions for the Fintrax application
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character (optional for now)
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score++;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score++;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Consider adding a special character for stronger security');
  } else {
    score++;
  }

  const isValid = feedback.length === 0 || (score >= 4 && password.length >= 8);

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { isValid, strength, feedback };
}

/**
 * Validate JWT token format (basic check)
 */
export function isValidJWTFormat(token: string): boolean {
  if (!token) return false;

  // JWT should have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Check if JWT token is expired (basic check, doesn't verify signature)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) return false;

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
}

/**
 * Get CSRF token from meta tag or cookie
 */
export function getCSRFToken(): string | null {
  // Try to get from meta tag first
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    return metaTag.getAttribute('content');
  }

  // Try to get from cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return value;
    }
  }

  return null;
}

/**
 * Rate limiting helper (client-side tracking)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if action is allowed based on rate limit
   */
  isAllowed(action: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(action) || [];

    // Filter out old requests outside the time window
    const recentRequests = requests.filter((timestamp) => now - timestamp < windowMs);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    // Record this request
    recentRequests.push(now);
    this.requests.set(action, recentRequests);

    return true;
  }

  /**
   * Clear all recorded requests
   */
  clear() {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Secure localStorage operations
 */
export const secureStorage = {
  /**
   * Set item in localStorage with optional expiration
   */
  setItem(key: string, value: any, expirationMs?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expirationMs ? Date.now() + expirationMs : null,
    };

    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  /**
   * Get item from localStorage, checking expiration
   */
  getItem(key: string): any | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);

      // Check if item has expired
      if (item.expiration && Date.now() > item.expiration) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Clear all items
   */
  clear(): void {
    localStorage.clear();
  },
};

/**
 * Content Security Policy helpers
 */
export const csp = {
  /**
   * Check if inline scripts are allowed (for security audit)
   */
  hasInlineScripts(): boolean {
    const scripts = document.querySelectorAll('script:not([src])');
    return scripts.length > 0;
  },

  /**
   * Check if eval() is being used (security risk)
   */
  usesEval(): boolean {
    // This is a basic check - in production, use CSP headers to block eval
    try {
      eval('1+1');
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Security audit helpers
 */
export const securityAudit = {
  /**
   * Run basic security checks
   */
  runChecks(): {
    passed: string[];
    failed: string[];
    warnings: string[];
  } {
    const passed: string[] = [];
    const failed: string[] = [];
    const warnings: string[] = [];

    // Check HTTPS
    if (window.location.protocol === 'https:') {
      passed.push('HTTPS enabled');
    } else if (window.location.hostname === 'localhost') {
      warnings.push('Running on localhost (HTTP acceptable for development)');
    } else {
      failed.push('HTTPS not enabled');
    }

    // Check for inline scripts
    if (!csp.hasInlineScripts()) {
      passed.push('No inline scripts detected');
    } else {
      warnings.push('Inline scripts detected (consider using nonces or hashes)');
    }

    // Check localStorage usage
    const tokenInStorage = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (!tokenInStorage) {
      passed.push('No sensitive tokens in localStorage');
    } else {
      warnings.push('Token found in localStorage (consider using httpOnly cookies)');
    }

    // Check for mixed content
    if (window.location.protocol === 'https:') {
      const images = document.querySelectorAll('img[src^="http:"]');
      if (images.length === 0) {
        passed.push('No mixed content (HTTP resources on HTTPS page)');
      } else {
        warnings.push(`${images.length} HTTP images on HTTPS page (mixed content)`);
      }
    }

    return { passed, failed, warnings };
  },
};

/**
 * Input validation helpers
 */
export const validators = {
  /**
   * Validate username
   */
  username(value: string): { valid: boolean; error?: string } {
    if (!value || value.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters' };
    }
    if (value.length > 30) {
      return { valid: false, error: 'Username must be less than 30 characters' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }
    return { valid: true };
  },

  /**
   * Validate amount (financial)
   */
  amount(value: any): { valid: boolean; error?: string } {
    const num = Number(value);
    if (isNaN(num)) {
      return { valid: false, error: 'Amount must be a valid number' };
    }
    if (num < 0) {
      return { valid: false, error: 'Amount cannot be negative' };
    }
    if (num > 999999999) {
      return { valid: false, error: 'Amount is too large' };
    }
    return { valid: true };
  },

  /**
   * Validate URL
   */
  url(value: string): { valid: boolean; error?: string } {
    try {
      new URL(value);
      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  },
};
