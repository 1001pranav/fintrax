/**
 * Strategy Pattern - Test Execution Strategy
 *
 * Defines different strategies for executing tests (parallel, sequential, etc.)
 */

import { Test, TestResult } from '../types';

export interface ITestExecutionStrategy {
  execute(tests: Test[]): Promise<TestResult[]>;
  getName(): string;
  getDescription(): string;
}

export abstract class TestExecutionStrategy implements ITestExecutionStrategy {
  abstract execute(tests: Test[]): Promise<TestResult[]>;
  abstract getName(): string;
  abstract getDescription(): string;

  protected async executeTest(test: Test): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Simulate test execution
      // In real implementation, this would run the actual test
      await this.runTest(test);

      const duration = Date.now() - startTime;
      return {
        name: test.name,
        passed: true,
        duration,
        errors: [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: test.name,
        passed: false,
        duration,
        errors: [(error as Error).message],
        timestamp: new Date().toISOString(),
      };
    }
  }

  protected async runTest(test: Test): Promise<void> {
    // This would be implemented with actual test execution logic
    // For now, simulate with a delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Randomly pass/fail for demonstration
    if (Math.random() > 0.9) {
      throw new Error(`Test "${test.name}" failed`);
    }
  }
}

/**
 * Usage:
 *
 * const strategy: ITestExecutionStrategy = new ParallelTestStrategy();
 * const results = await strategy.execute(tests);
 */
