/**
 * API Cache utility for optimizing API calls
 * Implements caching with TTL and request deduplication
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, PendingRequest<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get data from cache if valid, otherwise execute fetcher
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean } = {}
  ): Promise<T> {
    const { ttl = this.defaultTTL, forceRefresh = false } = options;

    // Check if there's a pending request for this key (request deduplication)
    const pending = this.pendingRequests.get(key);
    if (pending && !forceRefresh) {
      console.log(`[Cache] Deduplicating request for: ${key}`);
      return pending.promise;
    }

    // Check cache if not forcing refresh
    if (!forceRefresh) {
      const cached = this.cache.get(key);
      if (cached && Date.now() < cached.expiresAt) {
        console.log(`[Cache] Hit for: ${key}`);
        return cached.data;
      }
    }

    // Execute fetcher and store as pending request
    console.log(`[Cache] Miss for: ${key} - fetching...`);
    const promise = fetcher()
      .then((data) => {
        // Store in cache
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          expiresAt: Date.now() + ttl,
        });
        // Remove from pending
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        // Remove from pending on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store as pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    console.log(`[Cache] Invalidating: ${key}`);
    this.cache.delete(key);
  }

  /**
   * Invalidate multiple cache entries by pattern
   */
  invalidatePattern(pattern: string): void {
    console.log(`[Cache] Invalidating pattern: ${pattern}`);
    const regex = new RegExp(pattern);
    Array.from(this.cache.keys()).forEach((key) => {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear all cache
   */
  clear(): void {
    console.log('[Cache] Clearing all cache');
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get cached data without fetching (for stale-while-revalidate)
   */
  getStale<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached) {
      console.log(`[Cache] Returning stale data for: ${key}`);
      return cached.data;
    }
    return null;
  }

  /**
   * Check if cache entry exists and is valid
   */
  isValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? Date.now() < cached.expiresAt : false;
  }
}

// Singleton instance
export const apiCache = new ApiCache();

// Cache key generators
export const cacheKeys = {
  projects: () => 'projects:all',
  project: (id: number) => `projects:${id}`,

  financeSummary: () => 'finance:summary',
  transactions: () => 'finance:transactions',
  savings: () => 'finance:savings',
  loans: () => 'finance:loans',

  tasks: () => 'tasks:all',
  task: (id: number) => `tasks:${id}`,
  projectTasks: (projectId: number) => `tasks:project:${projectId}`,

  roadmaps: () => 'roadmaps:all',
  roadmap: (id: number) => `roadmaps:${id}`,
};
