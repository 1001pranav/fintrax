/**
 * Facade Pattern - Testing Facade
 *
 * Provides a simplified interface to the complex testing subsystem.
 * Coordinates unit, integration, E2E, performance, and security tests.
 */

import { TestReport, TestResult } from './types';
import { UnitTestRunner } from './runners/UnitTestRunner';
import { IntegrationTestRunner } from './runners/IntegrationTestRunner';
import { E2ETestRunner } from './runners/E2ETestRunner';
import { TestSuite } from './suites/TestComponent';

export class TestingFacade {
  private unitTestSuite: TestSuite;
  private integrationTestSuite: TestSuite;
  private e2eTestSuite: TestSuite;
  private performanceTestSuite: TestSuite;
  private securityTestSuite: TestSuite;

  constructor() {
    this.unitTestSuite = new TestSuite('Unit Tests');
    this.integrationTestSuite = new TestSuite('Integration Tests');
    this.e2eTestSuite = new TestSuite('E2E Tests');
    this.performanceTestSuite = new TestSuite('Performance Tests');
    this.securityTestSuite = new TestSuite('Security Tests');
  }

  /**
   * Add test suites
   */
  addUnitTestSuite(suite: TestSuite): void {
    this.unitTestSuite.add(suite);
  }

  addIntegrationTestSuite(suite: TestSuite): void {
    this.integrationTestSuite.add(suite);
  }

  addE2ETestSuite(suite: TestSuite): void {
    this.e2eTestSuite.add(suite);
  }

  addPerformanceTestSuite(suite: TestSuite): void {
    this.performanceTestSuite.add(suite);
  }

  addSecurityTestSuite(suite: TestSuite): void {
    this.securityTestSuite.add(suite);
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<TestReport> {
    console.log('\n' + '='.repeat(60));
    console.log('RUNNING COMPREHENSIVE TEST SUITE');
    console.log('='.repeat(60));

    const startTime = Date.now();
    const allResults: TestResult[] = [];

    // Run unit tests
    console.log('\n[1/5] Running unit tests...');
    await this.unitTestSuite.run();
    allResults.push(...this.unitTestSuite.getResults());

    // Run integration tests
    console.log('\n[2/5] Running integration tests...');
    await this.integrationTestSuite.run();
    allResults.push(...this.integrationTestSuite.getResults());

    // Run E2E tests
    console.log('\n[3/5] Running E2E tests...');
    await this.e2eTestSuite.run();
    allResults.push(...this.e2eTestSuite.getResults());

    // Run performance tests
    console.log('\n[4/5] Running performance tests...');
    await this.performanceTestSuite.run();
    allResults.push(...this.performanceTestSuite.getResults());

    // Run security tests
    console.log('\n[5/5] Running security tests...');
    await this.securityTestSuite.run();
    allResults.push(...this.securityTestSuite.getResults());

    const duration = Date.now() - startTime;
    return this.generateReport(allResults, duration);
  }

  /**
   * Run only critical tests (for CI/CD)
   */
  async runCriticalTests(): Promise<TestReport> {
    console.log('\n' + '='.repeat(60));
    console.log('RUNNING CRITICAL TESTS ONLY');
    console.log('='.repeat(60));

    const startTime = Date.now();
    const allResults: TestResult[] = [];

    // Run E2E critical flows
    console.log('\n[1/2] Running critical E2E tests...');
    await this.e2eTestSuite.run();
    allResults.push(...this.e2eTestSuite.getResults());

    // Run security tests
    console.log('\n[2/2] Running security tests...');
    await this.securityTestSuite.run();
    allResults.push(...this.securityTestSuite.getResults());

    const duration = Date.now() - startTime;
    return this.generateReport(allResults, duration);
  }

  /**
   * Run unit tests only
   */
  async runUnitTests(): Promise<TestReport> {
    console.log('\n' + '='.repeat(60));
    console.log('RUNNING UNIT TESTS');
    console.log('='.repeat(60));

    const startTime = Date.now();
    await this.unitTestSuite.run();
    const results = this.unitTestSuite.getResults();
    const duration = Date.now() - startTime;

    return this.generateReport(results, duration);
  }

  /**
   * Run integration tests only
   */
  async runIntegrationTests(): Promise<TestReport> {
    console.log('\n' + '='.repeat(60));
    console.log('RUNNING INTEGRATION TESTS');
    console.log('='.repeat(60));

    const startTime = Date.now();
    await this.integrationTestSuite.run();
    const results = this.integrationTestSuite.getResults();
    const duration = Date.now() - startTime;

    return this.generateReport(results, duration);
  }

  /**
   * Run E2E tests only
   */
  async runE2ETests(): Promise<TestReport> {
    console.log('\n' + '='.repeat(60));
    console.log('RUNNING E2E TESTS');
    console.log('='.repeat(60));

    const startTime = Date.now();
    await this.e2eTestSuite.run();
    const results = this.e2eTestSuite.getResults();
    const duration = Date.now() - startTime;

    return this.generateReport(results, duration);
  }

  /**
   * Generate test report
   */
  private generateReport(results: TestResult[], duration: number): TestReport {
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passed = failedTests === 0;

    const report: TestReport = {
      passed,
      totalTests,
      passedTests,
      failedTests,
      skippedTests: 0,
      duration,
      coverage: this.calculateCoverage(),
      results,
      timestamp: new Date().toISOString(),
    };

    this.printReport(report);
    return report;
  }

  /**
   * Print test report
   */
  private printReport(report: TestReport): void {
    console.log('\n' + '='.repeat(60));
    console.log('TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Status:       ${report.passed ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`Total Tests:  ${report.totalTests}`);
    console.log(
      `Passed:       ${report.passedTests} (${this.getPercentage(report.passedTests, report.totalTests)}%)`
    );
    console.log(
      `Failed:       ${report.failedTests} (${this.getPercentage(report.failedTests, report.totalTests)}%)`
    );
    console.log(`Duration:     ${this.formatDuration(report.duration)}`);
    if (report.coverage) {
      console.log(`Coverage:     ${report.coverage.toFixed(2)}%`);
    }
    console.log(`Timestamp:    ${report.timestamp}`);
    console.log('='.repeat(60));

    if (report.failedTests > 0) {
      console.log('\nFailed Tests:');
      report.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  ✗ ${r.name}`);
          r.errors.forEach((error) => console.log(`    - ${error}`));
        });
    }
  }

  /**
   * Calculate test coverage
   */
  private calculateCoverage(): number {
    // In a real implementation, this would use coverage tools like Istanbul/NYC
    // For now, return a mock value
    return 85.5;
  }

  /**
   * Helper methods
   */
  private getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return `${minutes}m ${seconds}s`;
    }
  }
}

/**
 * Usage:
 *
 * // Create facade
 * const testingFacade = new TestingFacade();
 *
 * // Add test suites
 * const authSuite = new TestSuite('Authentication');
 * authSuite.add(new Test('Login', async () => { ... }));
 * testingFacade.addUnitTestSuite(authSuite);
 *
 * // Run all tests
 * const report = await testingFacade.runAllTests();
 *
 * // Or run specific test types
 * const unitReport = await testingFacade.runUnitTests();
 * const criticalReport = await testingFacade.runCriticalTests();
 */
