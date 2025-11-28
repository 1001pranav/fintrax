/**
 * Template Method Pattern - Test Runner
 *
 * Defines the skeleton of the test execution algorithm,
 * deferring some steps to subclasses.
 */

import { TestResult } from '../types';

export abstract class TestRunner {
  /**
   * Template method - defines the test execution flow
   */
  async runTest(): Promise<TestResult> {
    const startTime = Date.now();
    let attempts = 0;
    let lastError: Error | null = null;

    console.log(`[${this.getTestType()}] Setting up test...`);
    await this.setup();

    // Retry logic
    const maxRetries = this.getMaxRetries();
    while (attempts <= maxRetries) {
      attempts++;

      try {
        console.log(`[${this.getTestType()}] Executing test (attempt ${attempts})...`);
        await this.execute();

        console.log(`[${this.getTestType()}] Test passed!`);
        await this.teardown();

        const duration = Date.now() - startTime;
        return this.reportResult(true, duration, [], attempts);
      } catch (error) {
        lastError = error as Error;
        console.error(`[${this.getTestType()}] Test failed (attempt ${attempts}):`, error);

        if (attempts > maxRetries) {
          break;
        }

        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempts) * 1000;
        console.log(`[${this.getTestType()}] Retrying in ${waitTime}ms...`);
        await this.wait(waitTime);
      }
    }

    // All attempts failed
    await this.teardown();
    const duration = Date.now() - startTime;
    const errors = lastError ? [lastError.message] : ['Unknown error'];
    return this.reportResult(false, duration, errors, attempts);
  }

  /**
   * Abstract methods to be implemented by subclasses
   */
  protected abstract setup(): Promise<void>;
  protected abstract execute(): Promise<void>;
  protected abstract getTestType(): string;

  /**
   * Teardown with optional override
   */
  protected async teardown(): Promise<void> {
    console.log(`[${this.getTestType()}] Cleaning up...`);
    // Default: no-op, subclasses can override
  }

  /**
   * Optional hooks that subclasses can override
   */
  protected getMaxRetries(): number {
    return 0; // Default: no retries
  }

  protected async beforeEach(): Promise<void> {
    // Hook for subclasses
  }

  protected async afterEach(): Promise<void> {
    // Hook for subclasses
  }

  /**
   * Report result with consistent format
   */
  protected reportResult(
    passed: boolean,
    duration: number,
    errors: string[],
    attempts: number
  ): TestResult {
    return {
      name: this.getTestType(),
      passed,
      duration,
      errors,
      timestamp: new Date().toISOString(),
      attempts,
    };
  }

  /**
   * Utility method
   */
  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
