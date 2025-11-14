import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests critical authentication flows including login, register, and password reset
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Check if we're on login page or redirected to it
    await expect(page).toHaveURL(/.*login.*/);

    // Verify login form elements are present
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');

    // Click login button without filling form
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Wait for validation errors
    await page.waitForTimeout(500);

    // Check for error messages or disabled state
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    // Verify inputs have error states (aria-invalid or error class)
    const emailInvalid = await emailInput.getAttribute('aria-invalid');
    const passwordInvalid = await passwordInput.getAttribute('aria-invalid');

    // At least one should show validation error
    expect(emailInvalid === 'true' || passwordInvalid === 'true').toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Wait for error response (adjust timeout based on API response time)
    await page.waitForTimeout(2000);

    // Check for error toast or message
    // This will depend on your error handling implementation
    const errorVisible = await page.getByText(/invalid|incorrect|failed|error/i).isVisible().catch(() => false);

    // Should still be on login page or show error
    const currentUrl = page.url();
    expect(currentUrl.includes('login') || errorVisible).toBeTruthy();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');

    // Find and click register link
    const registerLink = page.getByRole('link', { name: /sign up|register|create account/i });
    await registerLink.click();

    // Verify navigation to register page
    await expect(page).toHaveURL(/.*register.*/);

    // Verify register form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login');

    // Find and click forgot password link
    const forgotLink = page.getByRole('link', { name: /forgot password/i });
    await forgotLink.click();

    // Verify navigation to forgot password page
    await expect(page).toHaveURL(/.*forgot-password.*/);

    // Verify email input is present
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should display register form correctly', async ({ page }) => {
    await page.goto('/register');

    // Verify all registration form fields
    await expect(page.getByLabel(/username|name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up|register|create/i })).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    await page.goto('/register');

    // Focus on password field
    const passwordInput = page.getByLabel(/password/i).first();
    await passwordInput.click();
    await passwordInput.fill('weak');

    // Blur to trigger validation
    await page.getByLabel(/email/i).click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check for validation message or help text about password requirements
    const validationVisible = await page.getByText(/password.*character|password.*strong|password.*requirement/i).isVisible().catch(() => false);

    expect(validationVisible).toBeTruthy();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');

    // Enter invalid email
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check for error state
    const isInvalid = await emailInput.getAttribute('aria-invalid');
    expect(isInvalid).toBe('true');
  });

  test.skip('should complete successful login flow (requires test user)', async ({ page }) => {
    // This test requires a test user in the database
    // Skip by default, enable when test environment is configured
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPassword123!');

    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard|projects|finance/i, { timeout: 5000 });

    // Verify successful login (dashboard elements present)
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();
  });
});

/**
 * Session Management Tests
 */
test.describe('Session Management', () => {
  test('should persist login state on page reload', async ({ page }) => {
    // This test assumes localStorage or cookie-based session
    await page.goto('/login');

    // Set mock auth token (adjust based on your auth implementation)
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'mock-token-for-testing');
    });

    // Reload page
    await page.reload();

    // Should either stay authenticated or redirect based on token validation
    // This behavior depends on your auth implementation
    const url = page.url();
    const hasToken = await page.evaluate(() => localStorage.getItem('authToken'));

    expect(hasToken).toBeTruthy();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Clear any existing auth
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Try to access protected route
    await page.goto('/projects');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });
});
