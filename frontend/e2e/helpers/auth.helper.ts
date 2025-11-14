/**
 * E2E Test Authentication Helpers
 * Provides utilities for login, logout, and authenticated test setup
 */

import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

/**
 * Default test user credentials
 * These should be set up in the test environment
 */
export const TEST_USER: TestUser = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'Test123!@#',
  name: 'Test User',
};

/**
 * Login helper function
 * Navigates to login page and authenticates user
 */
export async function login(page: Page, user: TestUser = TEST_USER): Promise<void> {
  // Navigate to login page
  await page.goto('/login');

  // Wait for login form to be visible
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();

  // Fill in credentials
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);

  // Submit form
  await page.getByRole('button', { name: /login/i }).click();

  // Wait for successful login (redirect to dashboard or home)
  await page.waitForURL(/\/(dashboard|home|projects)/i, {
    timeout: 10000,
  });

  // Verify we're logged in by checking for user-specific element
  await expect(page.locator('[data-testid="user-menu"]').or(
    page.locator('text=/logout/i')
  )).toBeVisible({ timeout: 5000 });
}

/**
 * Logout helper function
 * Logs out the current user
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button or user menu
  const userMenu = page.locator('[data-testid="user-menu"]');
  const logoutButton = page.getByRole('button', { name: /logout/i });

  // If user menu exists, click it first
  if (await userMenu.isVisible()) {
    await userMenu.click();
  }

  // Click logout
  await logoutButton.click();

  // Wait for redirect to login page
  await page.waitForURL(/\/login/i, { timeout: 5000 });
}

/**
 * Register a new test user
 * Creates a new account for testing
 */
export async function register(page: Page, user: TestUser): Promise<void> {
  await page.goto('/register');

  await expect(page.getByRole('heading', { name: /register|sign up/i })).toBeVisible();

  // Fill registration form
  if (user.name) {
    await page.getByLabel(/name/i).fill(user.name);
  }
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).first().fill(user.password);

  // Handle confirm password field if it exists
  const confirmPasswordField = page.getByLabel(/confirm password/i);
  if (await confirmPasswordField.isVisible()) {
    await confirmPasswordField.fill(user.password);
  }

  // Submit registration
  await page.getByRole('button', { name: /register|sign up/i }).click();

  // Wait for OTP page or dashboard
  await page.waitForURL(/\/(verify|otp|dashboard)/i, { timeout: 10000 });
}

/**
 * Verify OTP code
 * For testing email verification flow
 */
export async function verifyOTP(page: Page, otpCode: string): Promise<void> {
  await expect(page.getByRole('heading', { name: /verify|otp/i })).toBeVisible();

  // Fill OTP code (assuming 6-digit code)
  const otpInput = page.getByLabel(/otp|code/i);
  await otpInput.fill(otpCode);

  // Submit OTP
  await page.getByRole('button', { name: /verify|submit/i }).click();

  // Wait for redirect after verification
  await page.waitForURL(/\/(dashboard|home)/i, { timeout: 10000 });
}

/**
 * Check if user is authenticated
 * Returns true if user appears to be logged in
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check for common authenticated indicators
    const userMenu = page.locator('[data-testid="user-menu"]');
    const logoutButton = page.getByRole('button', { name: /logout/i });
    const loginButton = page.getByRole('button', { name: /login/i });

    const hasUserMenu = await userMenu.isVisible({ timeout: 2000 }).catch(() => false);
    const hasLogoutButton = await logoutButton.isVisible({ timeout: 2000 }).catch(() => false);
    const hasLoginButton = await loginButton.isVisible({ timeout: 2000 }).catch(() => false);

    return (hasUserMenu || hasLogoutButton) && !hasLoginButton;
  } catch {
    return false;
  }
}

/**
 * Setup authenticated session
 * Helper to ensure user is logged in before tests
 */
export async function setupAuthenticatedSession(
  page: Page,
  user: TestUser = TEST_USER
): Promise<void> {
  const authenticated = await isAuthenticated(page);

  if (!authenticated) {
    await login(page, user);
  }

  // Verify authentication was successful
  expect(await isAuthenticated(page)).toBe(true);
}

/**
 * Clear authentication state
 * Clears cookies and local storage to reset auth state
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get authentication token from storage
 * Useful for API testing
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    return localStorage.getItem('token') ||
           localStorage.getItem('authToken') ||
           sessionStorage.getItem('token') ||
           null;
  });
}

/**
 * Set authentication token directly
 * Bypass login flow for faster test setup
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((tokenValue) => {
    localStorage.setItem('token', tokenValue);
  }, token);
}
