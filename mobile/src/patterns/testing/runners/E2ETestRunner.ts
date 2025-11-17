/**
 * E2E Test Runner - End-to-End tests with Detox
 *
 * Tests the entire application flow from user perspective.
 */

import { TestRunner } from './TestRunner';

export class E2ETestRunner extends TestRunner {
  private testName: string;
  private testFunction: (context: E2ETestContext) => Promise<void>;
  private context: E2ETestContext;

  constructor(
    testName: string,
    testFunction: (context: E2ETestContext) => Promise<void>
  ) {
    super();
    this.testName = testName;
    this.testFunction = testFunction;
    this.context = {
      device: null, // Will be initialized by Detox
      by: null,
      element: null,
      expect: null,
      waitFor: null,
    };
  }

  protected async setup(): Promise<void> {
    console.log(`[E2E Test] Launching app...`);

    // In a real implementation, this would use Detox
    // await device.launchApp({ newInstance: true });

    // Wait for app to be ready
    await this.waitForAppReady();

    console.log(`[E2E Test] App ready for: ${this.testName}`);
  }

  protected async execute(): Promise<void> {
    // Execute the E2E test
    await this.testFunction(this.context);
  }

  protected async teardown(): Promise<void> {
    console.log(`[E2E Test] Closing app...`);

    // Take screenshot if test failed
    // await device.takeScreenshot(this.testName);

    // Reset app state
    // await device.clearKeychain();

    console.log(`[E2E Test] Teardown complete`);
  }

  protected getTestType(): string {
    return `E2E Test: ${this.testName}`;
  }

  protected getMaxRetries(): number {
    return 1; // Allow 1 retry for E2E tests (they can be flaky)
  }

  private async waitForAppReady(): Promise<void> {
    // Wait for app to be fully loaded
    // In real implementation:
    // await waitFor(element(by.id('dashboard-screen'))).toBeVisible().withTimeout(10000);
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
}

export interface E2ETestContext {
  device: any;
  by: any;
  element: any;
  expect: any;
  waitFor: any;
}

/**
 * Usage with Detox:
 *
 * const runner = new E2ETestRunner('Complete login flow', async (context) => {
 *   // Wait for login screen
 *   await waitFor(element(by.id('login-screen'))).toBeVisible().withTimeout(5000);
 *
 *   // Enter email
 *   await element(by.id('email-input')).typeText('test@example.com');
 *
 *   // Enter password
 *   await element(by.id('password-input')).typeText('TestPassword123!');
 *
 *   // Tap login button
 *   await element(by.id('login-button')).tap();
 *
 *   // Wait for dashboard
 *   await waitFor(element(by.id('dashboard-screen'))).toBeVisible().withTimeout(10000);
 *
 *   // Verify user is logged in
 *   await expect(element(by.id('welcome-message'))).toBeVisible();
 * });
 *
 * const result = await runner.runTest();
 */
