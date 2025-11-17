/**
 * Sequential Test Execution Strategy
 *
 * Executes tests one by one in order.
 * Best for integration tests that depend on each other.
 */

import { Test, TestResult } from '../types';
import { TestExecutionStrategy } from './TestExecutionStrategy';

export class SequentialTestStrategy extends TestExecutionStrategy {
  private failFast: boolean;

  constructor(failFast: boolean = false) {
    super();
    this.failFast = failFast;
  }

  async execute(tests: Test[]): Promise<TestResult[]> {
    console.log(`[Sequential Strategy] Running ${tests.length} tests sequentially${this.failFast ? ' (fail-fast mode)' : ''}...`);

    const results: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(`[Sequential Strategy] Running test ${i + 1}/${tests.length}: ${test.name}`);

      const result = await this.executeTest(test);
      results.push(result);

      if (this.failFast && !result.passed) {
        console.log(`[Sequential Strategy] Test failed, stopping execution (fail-fast mode)`);
        break;
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    console.log(`[Sequential Strategy] Completed: ${passedCount}/${results.length} passed`);

    return results;
  }

  getName(): string {
    return 'sequential';
  }

  getDescription(): string {
    return `Executes tests sequentially${this.failFast ? ' with fail-fast' : ''}`;
  }
}

/**
 * Usage:
 *
 * // Run all tests sequentially
 * const strategy1 = new SequentialTestStrategy(false);
 * const results1 = await strategy1.execute(tests);
 *
 * // Run tests sequentially, stop on first failure
 * const strategy2 = new SequentialTestStrategy(true);
 * const results2 = await strategy2.execute(tests);
 */
