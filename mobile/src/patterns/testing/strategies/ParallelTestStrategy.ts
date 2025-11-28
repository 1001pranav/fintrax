/**
 * Parallel Test Execution Strategy
 *
 * Executes all tests concurrently for faster execution.
 * Best for independent unit tests.
 */

import { Test, TestResult } from '../types';
import { TestExecutionStrategy } from './TestExecutionStrategy';

export class ParallelTestStrategy extends TestExecutionStrategy {
  private maxConcurrency: number;

  constructor(maxConcurrency: number = 10) {
    super();
    this.maxConcurrency = maxConcurrency;
  }

  async execute(tests: Test[]): Promise<TestResult[]> {
    console.log(
      `[Parallel Strategy] Running ${tests.length} tests in parallel (max concurrency: ${this.maxConcurrency})...`
    );

    const results: TestResult[] = [];
    const batches = this.createBatches(tests, this.maxConcurrency);

    for (const batch of batches) {
      const batchResults = await Promise.all(batch.map((test) => this.executeTest(test)));
      results.push(...batchResults);
    }

    const passedCount = results.filter((r) => r.passed).length;
    console.log(`[Parallel Strategy] Completed: ${passedCount}/${tests.length} passed`);

    return results;
  }

  getName(): string {
    return 'parallel';
  }

  getDescription(): string {
    return `Executes tests in parallel with max concurrency of ${this.maxConcurrency}`;
  }

  private createBatches(tests: Test[], batchSize: number): Test[][] {
    const batches: Test[][] = [];

    for (let i = 0; i < tests.length; i += batchSize) {
      batches.push(tests.slice(i, i + batchSize));
    }

    return batches;
  }
}

/**
 * Usage:
 *
 * const strategy = new ParallelTestStrategy(5); // Max 5 concurrent tests
 * const results = await strategy.execute(tests);
 */
