/**
 * Priority Test Execution Strategy
 *
 * Executes tests based on priority tags (critical tests first).
 * Useful for CI/CD pipelines with time constraints.
 */

import { Test, TestResult } from '../types';
import { TestExecutionStrategy } from './TestExecutionStrategy';

export class PriorityTestStrategy extends TestExecutionStrategy {
  private priorityOrder: string[];

  constructor(priorityOrder: string[] = ['critical', 'high', 'medium', 'low']) {
    super();
    this.priorityOrder = priorityOrder;
  }

  async execute(tests: Test[]): Promise<TestResult[]> {
    console.log(`[Priority Strategy] Running ${tests.length} tests by priority...`);

    // Sort tests by priority
    const sortedTests = this.sortByPriority(tests);

    // Execute tests sequentially (high priority first)
    const results: TestResult[] = [];

    for (const test of sortedTests) {
      const priority = this.getTestPriority(test);
      console.log(`[Priority Strategy] Running ${priority} priority test: ${test.name}`);

      const result = await this.executeTest(test);
      results.push(result);
    }

    const passedCount = results.filter((r) => r.passed).length;
    console.log(`[Priority Strategy] Completed: ${passedCount}/${tests.length} passed`);

    return results;
  }

  getName(): string {
    return 'priority';
  }

  getDescription(): string {
    return `Executes tests by priority: ${this.priorityOrder.join(' > ')}`;
  }

  private sortByPriority(tests: Test[]): Test[] {
    return [...tests].sort((a, b) => {
      const priorityA = this.getPriorityIndex(a);
      const priorityB = this.getPriorityIndex(b);
      return priorityA - priorityB;
    });
  }

  private getPriorityIndex(test: Test): number {
    const priority = this.getTestPriority(test);
    const index = this.priorityOrder.indexOf(priority);
    return index === -1 ? this.priorityOrder.length : index;
  }

  private getTestPriority(test: Test): string {
    // Check test tags for priority
    for (const priority of this.priorityOrder) {
      if (test.tags.includes(priority)) {
        return priority;
      }
    }
    return 'low'; // Default priority
  }
}

/**
 * Usage:
 *
 * // Run tests by priority (critical first)
 * const strategy = new PriorityTestStrategy(['critical', 'high', 'medium', 'low']);
 * const results = await strategy.execute(tests);
 *
 * // Define tests with priority tags
 * const criticalTest = new TestBuilder()
 *   .setName('Login flow')
 *   .setTags(['critical', 'auth'])
 *   .build();
 */
