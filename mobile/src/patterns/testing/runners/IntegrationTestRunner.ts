/**
 * Integration Test Runner - Tests API integration and data flow
 *
 * Tests the integration between multiple components with real API calls.
 */

import { TestRunner } from './TestRunner';
import axios from 'axios';
import { getApiHost } from '../../../utils/apiConfig';

export class IntegrationTestRunner extends TestRunner {
  private testName: string;
  private testFunction: (context: IntegrationTestContext) => Promise<void>;
  private context: IntegrationTestContext;

  constructor(testName: string, testFunction: (context: IntegrationTestContext) => Promise<void>) {
    super();
    this.testName = testName;
    this.testFunction = testFunction;
    this.context = {
      api: axios.create({ baseURL: getApiHost() }),
      testData: {},
      createdRecords: [],
    };
  }

  protected async setup(): Promise<void> {
    console.log(`[Integration Test] Setting up test environment...`);

    // Initialize test database
    await this.initializeTestDatabase();

    // Create test data
    await this.createTestData();

    console.log(`[Integration Test] Setup complete for: ${this.testName}`);
  }

  protected async execute(): Promise<void> {
    // Execute the integration test
    await this.testFunction(this.context);
  }

  protected async teardown(): Promise<void> {
    console.log(`[Integration Test] Cleaning up test data...`);

    // Delete created records
    await this.cleanupTestData();

    // Reset test database
    await this.resetTestDatabase();

    console.log(`[Integration Test] Cleanup complete`);
  }

  protected getTestType(): string {
    return `Integration Test: ${this.testName}`;
  }

  protected getMaxRetries(): number {
    return 2; // Allow up to 2 retries for network issues
  }

  private async initializeTestDatabase(): Promise<void> {
    // Initialize test database (could be SQLite or mock API)
    // For now, just a placeholder
  }

  private async createTestData(): Promise<void> {
    // Create necessary test data
    this.context.testData = {
      testUser: {
        email: 'test@example.com',
        password: 'TestPassword123!',
      },
    };
  }

  private async cleanupTestData(): Promise<void> {
    // Delete all created records
    for (const recordId of this.context.createdRecords) {
      try {
        // Delete record (actual implementation would call API)
        console.log(`Deleting test record: ${recordId}`);
      } catch (error) {
        console.warn(`Failed to delete record ${recordId}:`, error);
      }
    }
    this.context.createdRecords = [];
  }

  private async resetTestDatabase(): Promise<void> {
    // Reset test database to initial state
  }
}

export interface IntegrationTestContext {
  api: any;
  testData: any;
  createdRecords: string[];
}

/**
 * Usage:
 *
 * const runner = new IntegrationTestRunner('User registration flow', async (context) => {
 *   // Register user
 *   const response = await context.api.post('/user/register', {
 *     email: 'test@example.com',
 *     password: 'TestPassword123!',
 *   });
 *
 *   expect(response.status).toBe(200);
 *   expect(response.data.token).toBeDefined();
 *
 *   context.createdRecords.push(response.data.user_id);
 * });
 *
 * const result = await runner.runTest();
 */
