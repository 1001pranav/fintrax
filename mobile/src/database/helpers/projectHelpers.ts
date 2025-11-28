/**
 * Project Database Helper
 * Implements Repository Pattern for Project data access
 * Provides abstraction layer over SQLite operations
 */

import { sqliteService } from '../../services/storage';
import { Project } from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Project Repository Interface (Repository Pattern)
 */
export interface IProjectRepository {
  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  update(id: string, updates: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Project | null>;
  getAll(includeDeleted?: boolean): Promise<Project[]>;
  search(query: string): Promise<Project[]>;
  getPending(): Promise<Project[]>;
  getProjectStats(
    projectId: string
  ): Promise<{ total: number; completed: number; percentage: number }>;
}

/**
 * Project Repository Implementation
 */
export class ProjectRepository implements IProjectRepository {
  private static instance: ProjectRepository;
  private readonly TABLE_NAME = 'projects';

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  /**
   * Create a new project
   */
  async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      ...projectData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    const dbProject = this.toDbFormat(project);
    await sqliteService.insert(this.TABLE_NAME, dbProject);
    return project;
  }

  /**
   * Update an existing project
   */
  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Project not found: ${id}`);
    }

    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const dbProject = this.toDbFormat(updated);
    await sqliteService.update(this.TABLE_NAME, id, dbProject);
    return updated;
  }

  /**
   * Soft delete a project
   */
  async delete(id: string): Promise<void> {
    await sqliteService.delete(this.TABLE_NAME, id);
  }

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project | null> {
    const result = await sqliteService.getById<any>(this.TABLE_NAME, id);
    return result ? this.fromDbFormat(result) : null;
  }

  /**
   * Get all projects
   */
  async getAll(includeDeleted = false): Promise<Project[]> {
    const results = await sqliteService.getAll<any>(this.TABLE_NAME, includeDeleted);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Search projects by name or description
   */
  async search(query: string): Promise<Project[]> {
    const sql = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE isDeleted = 0
      AND (name LIKE ? OR description LIKE ?)
      ORDER BY updatedAt DESC
    `;
    const searchTerm = `%${query}%`;
    const results = await sqliteService.query<any>(sql, [searchTerm, searchTerm]);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get projects pending sync
   */
  async getPending(): Promise<Project[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      syncStatus: 'pending',
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get project statistics (task count and completion)
   */
  async getProjectStats(
    projectId: string
  ): Promise<{ total: number; completed: number; percentage: number }> {
    const sql = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = '6' THEN 1 END) as completed
      FROM tasks
      WHERE projectId = ?
      AND isDeleted = 0
    `;
    const results = await sqliteService.query<any>(sql, [projectId]);
    const { total = 0, completed = 0 } = results[0] || {};
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }

  /**
   * Mark project as synced
   */
  async markSynced(id: string, serverId?: string): Promise<void> {
    const updates: any = { syncStatus: 'synced' };
    if (serverId && id !== serverId) {
      updates.id = serverId;
      updates.localId = id;
    }
    await sqliteService.update(this.TABLE_NAME, id, updates);
  }

  /**
   * Mark project as pending sync
   */
  async markPending(id: string): Promise<void> {
    await sqliteService.update(this.TABLE_NAME, id, {
      syncStatus: 'pending',
    } as any);
  }

  /**
   * Convert project to database format
   */
  private toDbFormat(project: Project): any {
    return {
      id: project.id,
      name: project.name,
      description: project.description || null,
      color: project.color,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      isDeleted: 0,
      localId: project.localId || null,
      syncStatus: project.syncStatus || 'pending',
    };
  }

  /**
   * Convert database record to project
   */
  private fromDbFormat(dbProject: any): Project {
    return {
      id: dbProject.id,
      name: dbProject.name,
      description: dbProject.description,
      color: dbProject.color,
      userId: dbProject.userId,
      createdAt: dbProject.createdAt,
      updatedAt: dbProject.updatedAt,
      localId: dbProject.localId,
      syncStatus: dbProject.syncStatus,
    };
  }
}

// Export singleton instance
export const projectRepository = ProjectRepository.getInstance();
