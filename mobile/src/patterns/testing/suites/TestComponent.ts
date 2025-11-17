/**
 * Composite Pattern - Test Component
 *
 * Allows treating individual tests and test suites uniformly.
 * Creates a tree structure for organizing tests hierarchically.
 */

import { TestResult } from '../types';

export interface ITestComponent {
  run(): Promise<TestResult>;
  getName(): string;
  getResults(): TestResult[];
  add?(component: ITestComponent): void;
  remove?(component: ITestComponent): void;
  getChild?(index: number): ITestComponent | null;
  getChildCount?(): number;
}

/**
 * Leaf node - Individual Test
 */
export class Test implements ITestComponent {
  private name: string;
  private testFunction: () => Promise<void> | void;
  private result: TestResult | null = null;

  constructor(name: string, testFunction: () => Promise<void> | void) {
    this.name = name;
    this.testFunction = testFunction;
  }

  async run(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      console.log(`  Running test: ${this.name}`);
      await this.testFunction();

      const duration = Date.now() - startTime;
      this.result = {
        name: this.name,
        passed: true,
        duration,
        errors: [],
        timestamp: new Date().toISOString(),
      };

      console.log(`  ✓ ${this.name} (${duration}ms)`);
      return this.result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.result = {
        name: this.name,
        passed: false,
        duration,
        errors: [(error as Error).message],
        timestamp: new Date().toISOString(),
      };

      console.log(`  ✗ ${this.name} (${duration}ms)`);
      console.error(`    Error: ${(error as Error).message}`);
      return this.result;
    }
  }

  getName(): string {
    return this.name;
  }

  getResults(): TestResult[] {
    return this.result ? [this.result] : [];
  }
}

/**
 * Composite node - Test Suite
 */
export class TestSuite implements ITestComponent {
  private name: string;
  private children: ITestComponent[] = [];
  private results: TestResult[] = [];
  private beforeEach?: () => Promise<void> | void;
  private afterEach?: () => Promise<void> | void;

  constructor(name: string) {
    this.name = name;
  }

  add(component: ITestComponent): void {
    this.children.push(component);
  }

  remove(component: ITestComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getChild(index: number): ITestComponent | null {
    return this.children[index] || null;
  }

  getChildCount(): number {
    return this.children.length;
  }

  setBeforeEach(fn: () => Promise<void> | void): void {
    this.beforeEach = fn;
  }

  setAfterEach(fn: () => Promise<void> | void): void {
    this.afterEach = fn;
  }

  async run(): Promise<TestResult> {
    console.log(`\nRunning test suite: ${this.name}`);
    console.log(`${'='.repeat(this.name.length + 20)}`);

    const startTime = Date.now();
    this.results = [];

    for (const child of this.children) {
      if (this.beforeEach) {
        await this.beforeEach();
      }

      const result = await child.run();
      this.results.push(result);

      // Collect nested results if child is a suite
      const childResults = child.getResults();
      if (childResults.length > 1) {
        this.results.push(...childResults);
      }

      if (this.afterEach) {
        await this.afterEach();
      }
    }

    const duration = Date.now() - startTime;
    const passed = this.results.every(r => r.passed);
    const passedCount = this.results.filter(r => r.passed).length;

    console.log(`\nSuite "${this.name}" completed: ${passedCount}/${this.results.length} passed (${duration}ms)`);

    return {
      name: this.name,
      passed,
      duration,
      errors: this.results.flatMap(r => r.errors),
      timestamp: new Date().toISOString(),
    };
  }

  getName(): string {
    return this.name;
  }

  getResults(): TestResult[] {
    return this.results;
  }

  /**
   * Get summary statistics
   */
  getSummary(): TestSuiteSummary {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      name: this.name,
      totalTests,
      passedTests,
      failedTests,
      passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      totalDuration,
    };
  }
}

export interface TestSuiteSummary {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  totalDuration: number;
}

/**
 * Usage:
 *
 * // Create test hierarchy
 * const authSuite = new TestSuite('Authentication');
 * authSuite.add(new Test('Login with email', async () => {
 *   // Test implementation
 * }));
 * authSuite.add(new Test('Login with biometrics', async () => {
 *   // Test implementation
 * }));
 *
 * const tasksSuite = new TestSuite('Tasks');
 * tasksSuite.add(new Test('Create task', async () => {
 *   // Test implementation
 * }));
 *
 * const rootSuite = new TestSuite('All Tests');
 * rootSuite.add(authSuite);
 * rootSuite.add(tasksSuite);
 *
 * // Run all tests
 * await rootSuite.run();
 * const summary = rootSuite.getSummary();
 */
