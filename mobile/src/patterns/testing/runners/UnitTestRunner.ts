/**
 * Unit Test Runner - Concrete implementation of TestRunner
 *
 * Runs unit tests with fast execution and no external dependencies.
 */

import { TestRunner } from './TestRunner';

export class UnitTestRunner extends TestRunner {
  private testFunction: () => Promise<void> | void;
  private testName: string;
  private mockData: any = {};

  constructor(testName: string, testFunction: () => Promise<void> | void) {
    super();
    this.testName = testName;
    this.testFunction = testFunction;
  }

  protected async setup(): Promise<void> {
    // Set up mocks
    this.mockData = {
      api: this.createMockAPI(),
      storage: this.createMockStorage(),
    };

    console.log(`[Unit Test] Set up mocks for: ${this.testName}`);
  }

  protected async execute(): Promise<void> {
    // Execute the test function
    await this.testFunction();
  }

  protected async teardown(): Promise<void> {
    // Clean up mocks
    this.mockData = {};
    console.log(`[Unit Test] Cleaned up mocks`);
  }

  protected getTestType(): string {
    return `Unit Test: ${this.testName}`;
  }

  protected getMaxRetries(): number {
    return 0; // Unit tests shouldn't need retries
  }

  private createMockAPI() {
    return {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
  }

  private createMockStorage() {
    return {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  }
}

/**
 * Usage:
 *
 * const runner = new UnitTestRunner('Login validation', async () => {
 *   const result = validateEmail('test@example.com');
 *   expect(result).toBe(true);
 * });
 *
 * const result = await runner.runTest();
 */
