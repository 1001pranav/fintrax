/**
 * Builder Pattern - Test Builder
 *
 * Provides a flexible way to construct test objects with various configurations.
 * Makes test creation more readable and maintainable.
 */

import { Test, TestConfig, TestData, TestExpectation } from '../types';

export interface ITestBuilder {
  setName(name: string): ITestBuilder;
  setDescription(description: string): ITestBuilder;
  setTestData(data: TestData): ITestBuilder;
  setExpectation(expectation: TestExpectation): ITestBuilder;
  setTags(tags: string[]): ITestBuilder;
  setTimeout(timeout: number): ITestBuilder;
  setRetries(retries: number): ITestBuilder;
  build(): Test;
}

export class TestBuilder implements ITestBuilder {
  private test: Partial<Test> = {
    tags: [],
    timeout: 5000,
    retries: 0,
  };

  setName(name: string): ITestBuilder {
    this.test.name = name;
    return this;
  }

  setDescription(description: string): ITestBuilder {
    this.test.description = description;
    return this;
  }

  setTestData(data: TestData): ITestBuilder {
    this.test.data = data;
    return this;
  }

  setExpectation(expectation: TestExpectation): ITestBuilder {
    this.test.expectation = expectation;
    return this;
  }

  setTags(tags: string[]): ITestBuilder {
    this.test.tags = tags;
    return this;
  }

  setTimeout(timeout: number): ITestBuilder {
    this.test.timeout = timeout;
    return this;
  }

  setRetries(retries: number): ITestBuilder {
    this.test.retries = retries;
    return this;
  }

  build(): Test {
    if (!this.test.name) {
      throw new Error('Test name is required');
    }

    return {
      id: this.generateTestId(),
      name: this.test.name,
      description: this.test.description || '',
      data: this.test.data || {},
      expectation: this.test.expectation || {},
      tags: this.test.tags || [],
      timeout: this.test.timeout || 5000,
      retries: this.test.retries || 0,
      createdAt: new Date().toISOString(),
    } as Test;
  }

  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  reset(): ITestBuilder {
    this.test = {
      tags: [],
      timeout: 5000,
      retries: 0,
    };
    return this;
  }
}

/**
 * Fluent API usage example:
 *
 * const test = new TestBuilder()
 *   .setName('User login test')
 *   .setDescription('Test user login with valid credentials')
 *   .setTestData({ email: 'test@example.com', password: 'password123' })
 *   .setExpectation({ status: 200, hasToken: true })
 *   .setTags(['auth', 'integration'])
 *   .setTimeout(10000)
 *   .build();
 */
