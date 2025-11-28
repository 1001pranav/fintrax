/**
 * Repository Pattern - Feedback Repository
 *
 * Abstracts data access for feedback collection.
 * Provides a consistent interface for storing and retrieving feedback.
 */

import { Feedback } from '../../testing/types';

export interface IFeedbackRepository {
  getAll(): Promise<Feedback[]>;
  getById(id: string): Promise<Feedback | null>;
  create(feedback: Feedback): Promise<Feedback>;
  update(id: string, feedback: Partial<Feedback>): Promise<Feedback>;
  delete(id: string): Promise<void>;
  getByCategory(category: string): Promise<Feedback[]>;
  getByStatus(status: string): Promise<Feedback[]>;
  getUnresolved(): Promise<Feedback[]>;
}

export class FeedbackRepository implements IFeedbackRepository {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:80/api') {
    this.apiUrl = apiUrl;
  }

  async getAll(): Promise<Feedback[]> {
    try {
      // In real implementation, this would call the API
      // const response = await fetch(`${this.apiUrl}/feedback`);
      // return await response.json();

      console.log('[Feedback Repository] Fetching all feedback...');
      return this.getMockFeedback();
    } catch (error) {
      console.error('[Feedback Repository] Error fetching feedback:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Feedback | null> {
    try {
      console.log(`[Feedback Repository] Fetching feedback: ${id}`);
      const allFeedback = await this.getAll();
      return allFeedback.find((f) => f.id === id) || null;
    } catch (error) {
      console.error(`[Feedback Repository] Error fetching feedback ${id}:`, error);
      throw error;
    }
  }

  async create(feedback: Feedback): Promise<Feedback> {
    try {
      console.log(`[Feedback Repository] Creating feedback: ${feedback.title}`);

      // In real implementation:
      // const response = await fetch(`${this.apiUrl}/feedback`, {
      //   method: 'POST',
      //   body: JSON.stringify(feedback),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // return await response.json();

      feedback.id = this.generateId();
      feedback.timestamp = new Date().toISOString();
      return feedback;
    } catch (error) {
      console.error('[Feedback Repository] Error creating feedback:', error);
      throw error;
    }
  }

  async update(id: string, feedbackUpdate: Partial<Feedback>): Promise<Feedback> {
    try {
      console.log(`[Feedback Repository] Updating feedback: ${id}`);

      // In real implementation:
      // const response = await fetch(`${this.apiUrl}/feedback/${id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(feedbackUpdate),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // return await response.json();

      const existing = await this.getById(id);
      if (!existing) {
        throw new Error(`Feedback ${id} not found`);
      }

      return { ...existing, ...feedbackUpdate };
    } catch (error) {
      console.error(`[Feedback Repository] Error updating feedback ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`[Feedback Repository] Deleting feedback: ${id}`);

      // In real implementation:
      // await fetch(`${this.apiUrl}/feedback/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error(`[Feedback Repository] Error deleting feedback ${id}:`, error);
      throw error;
    }
  }

  async getByCategory(category: string): Promise<Feedback[]> {
    try {
      console.log(`[Feedback Repository] Fetching feedback by category: ${category}`);
      const allFeedback = await this.getAll();
      return allFeedback.filter((f) => f.category === category);
    } catch (error) {
      console.error(`[Feedback Repository] Error fetching feedback by category:`, error);
      throw error;
    }
  }

  async getByStatus(status: string): Promise<Feedback[]> {
    try {
      console.log(`[Feedback Repository] Fetching feedback by status: ${status}`);
      const allFeedback = await this.getAll();
      return allFeedback.filter((f) => f.status === status);
    } catch (error) {
      console.error(`[Feedback Repository] Error fetching feedback by status:`, error);
      throw error;
    }
  }

  async getUnresolved(): Promise<Feedback[]> {
    try {
      console.log(`[Feedback Repository] Fetching unresolved feedback...`);
      const allFeedback = await this.getAll();
      return allFeedback.filter((f) => f.status === 'new' || f.status === 'reviewed');
    } catch (error) {
      console.error(`[Feedback Repository] Error fetching unresolved feedback:`, error);
      throw error;
    }
  }

  private generateId(): string {
    return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getMockFeedback(): Feedback[] {
    return [
      {
        id: 'fb-001',
        userId: 'user-123',
        category: 'bug',
        title: 'Login button not responsive',
        description: 'The login button sometimes does not respond to taps',
        rating: 2,
        deviceInfo: {
          platform: 'ios',
          version: '17.0',
          model: 'iPhone 13',
        },
        timestamp: new Date().toISOString(),
        status: 'new',
      },
      {
        id: 'fb-002',
        userId: 'user-456',
        category: 'feature_request',
        title: 'Add dark mode',
        description: 'Please add a dark mode option',
        rating: 5,
        deviceInfo: {
          platform: 'android',
          version: '13',
          model: 'Pixel 5',
        },
        timestamp: new Date().toISOString(),
        status: 'reviewed',
      },
    ];
  }
}

/**
 * Usage:
 *
 * const feedbackRepo = new FeedbackRepository();
 *
 * // Create feedback
 * const feedback = await feedbackRepo.create({
 *   userId: 'user-123',
 *   category: 'bug',
 *   title: 'App crashes on startup',
 *   description: 'Details...',
 *   deviceInfo: { platform: 'ios', version: '17.0', model: 'iPhone 15' },
 * });
 *
 * // Get all feedback
 * const allFeedback = await feedbackRepo.getAll();
 *
 * // Get by category
 * const bugs = await feedbackRepo.getByCategory('bug');
 */
