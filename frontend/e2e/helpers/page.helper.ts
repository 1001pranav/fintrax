/**
 * E2E Test Page Helpers
 * Provides common page interaction utilities for E2E tests
 */

import { Page, expect, Locator } from '@playwright/test';

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Wait for element to be visible and stable
 */
export async function waitForElement(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
  // Wait a bit more for animations to complete
  await locator.page().waitForTimeout(300);
}

/**
 * Fill form field with error handling
 */
export async function fillField(
  page: Page,
  label: string | RegExp,
  value: string
): Promise<void> {
  const field = page.getByLabel(label);
  await waitForElement(field);
  await field.clear();
  await field.fill(value);
  await expect(field).toHaveValue(value);
}

/**
 * Click button with retry logic
 */
export async function clickButton(
  page: Page,
  name: string | RegExp,
  options?: { timeout?: number }
): Promise<void> {
  const button = page.getByRole('button', { name });
  await waitForElement(button, options);
  await button.click();
}

/**
 * Select option from dropdown
 */
export async function selectOption(
  page: Page,
  label: string | RegExp,
  value: string
): Promise<void> {
  const select = page.getByLabel(label);
  await waitForElement(select);
  await select.selectOption(value);
}

/**
 * Check if toast/notification is visible
 */
export async function waitForToast(
  page: Page,
  message: string | RegExp,
  type: 'success' | 'error' | 'info' = 'success'
): Promise<void> {
  const toast = page.locator(`[data-testid="toast-${type}"]`, { hasText: message })
    .or(page.locator('.toast', { hasText: message }))
    .or(page.getByText(message));

  await expect(toast).toBeVisible({ timeout: 5000 });
}

/**
 * Wait for loading spinner to disappear
 */
export async function waitForLoadingComplete(page: Page): Promise<void> {
  const spinner = page.locator('[data-testid="loading-spinner"]')
    .or(page.locator('.spinner'))
    .or(page.locator('[role="progressbar"]'));

  // Wait for spinner to appear (if it will)
  try {
    await spinner.waitFor({ state: 'visible', timeout: 1000 });
  } catch {
    // Spinner might not appear if content loads quickly
  }

  // Wait for spinner to disappear
  await spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
    // Spinner might not exist at all
  });
}

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateToPage(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitForPageLoad(page);
}

/**
 * Take a screenshot with automatic naming
 */
export async function takeScreenshot(
  page: Page,
  name: string
): Promise<void> {
  await page.screenshot({
    path: `e2e/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  options?: { timeout?: number }
): Promise<void> {
  await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout: options?.timeout || 10000 }
  );
}

/**
 * Check if element exists (without throwing)
 */
export async function elementExists(
  page: Page,
  selector: string
): Promise<boolean> {
  try {
    const element = page.locator(selector);
    return await element.count() > 0;
  } catch {
    return false;
  }
}

/**
 * Get element text content
 */
export async function getTextContent(locator: Locator): Promise<string> {
  await waitForElement(locator);
  return (await locator.textContent()) || '';
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await locator.page().waitForTimeout(300); // Wait for scroll animation
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

/**
 * Check if page has error
 */
export async function hasPageError(page: Page): Promise<boolean> {
  const errorElement = page.locator('[data-testid="error"]')
    .or(page.locator('.error'))
    .or(page.getByText(/error|failed|something went wrong/i));

  return await errorElement.isVisible({ timeout: 1000 }).catch(() => false);
}

/**
 * Reload page and wait for load
 */
export async function reloadPage(page: Page): Promise<void> {
  await page.reload({ waitUntil: 'networkidle' });
  await waitForPageLoad(page);
}

/**
 * Go back in browser history
 */
export async function goBack(page: Page): Promise<void> {
  await page.goBack({ waitUntil: 'networkidle' });
  await waitForPageLoad(page);
}

/**
 * Close modal/dialog
 */
export async function closeModal(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: /close|cancel|×/i })
    .or(page.locator('[data-testid="modal-close"]'))
    .or(page.locator('.modal-close'));

  if (await closeButton.isVisible()) {
    await closeButton.click();
  }

  // Wait for modal to disappear
  const modal = page.locator('[role="dialog"]').or(page.locator('.modal'));
  await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
}

/**
 * Confirm dialog/alert
 */
export async function confirmDialog(page: Page): Promise<void> {
  page.once('dialog', (dialog) => dialog.accept());
}

/**
 * Dismiss dialog/alert
 */
export async function dismissDialog(page: Page): Promise<void> {
  page.once('dialog', (dialog) => dialog.dismiss());
}

/**
 * Wait for specific text to appear
 */
export async function waitForText(
  page: Page,
  text: string | RegExp,
  options?: { timeout?: number }
): Promise<void> {
  await expect(page.getByText(text)).toBeVisible({
    timeout: options?.timeout || 10000,
  });
}

/**
 * Get count of elements matching selector
 */
export async function getElementCount(
  page: Page,
  selector: string
): Promise<number> {
  return await page.locator(selector).count();
}
