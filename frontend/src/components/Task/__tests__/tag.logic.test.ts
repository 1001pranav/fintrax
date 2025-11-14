/**
 * Unit tests for tag-related business logic
 * Tests tag filtering, validation, and utility functions
 */

import { Task, Tags } from '@/constants/interfaces';
import { TASK_TAG_COLORS } from '@/constants/generalConstants';

// Mock tasks with tags for testing
const mockTags: Tags[] = [
  { id: '1', name: 'Frontend', color: '#FF5733' },
  { id: '2', name: 'Backend', color: '#3B82F6' },
  { id: '3', name: 'Bug', color: '#EF4444' },
  { id: '4', name: 'Feature', color: '#10B981' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Frontend task',
    priority: 'high',
    status: 'todo',
    projectId: '1',
    tags: [mockTags[0]], // Frontend
    createdDate: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Backend task',
    priority: 'medium',
    status: 'in-progress',
    projectId: '1',
    tags: [mockTags[1]], // Backend
    createdDate: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Full-stack task',
    priority: 'low',
    status: 'done',
    projectId: '1',
    tags: [mockTags[0], mockTags[1]], // Frontend + Backend
    createdDate: new Date('2024-01-03'),
  },
  {
    id: '4',
    title: 'Task 4',
    description: 'Bug fix',
    priority: 'high',
    status: 'todo',
    projectId: '1',
    tags: [mockTags[2]], // Bug
    createdDate: new Date('2024-01-04'),
  },
  {
    id: '5',
    title: 'Task 5',
    description: 'No tags',
    priority: 'medium',
    status: 'in-progress',
    projectId: '1',
    tags: [],
    createdDate: new Date('2024-01-05'),
  },
];

/**
 * Filter tasks by tag ID
 * Replicates the logic from Kanban.tsx
 */
const filterTasksByTag = (tasks: Task[], tagId: string | null): Task[] => {
  if (!tagId) return tasks;
  return tasks.filter((task) => task.tags.some((tag) => tag.id === tagId));
};

/**
 * Validate tag name
 */
const validateTagName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Tag name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Tag name must be at least 2 characters' };
  }

  if (name.trim().length > 50) {
    return { valid: false, error: 'Tag name must be less than 50 characters' };
  }

  return { valid: true };
};

/**
 * Validate tag color
 */
const validateTagColor = (color: string): { valid: boolean; error?: string } => {
  if (!color) {
    return { valid: false, error: 'Tag color is required' };
  }

  // Check if it's a valid hex color
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexColorRegex.test(color)) {
    return { valid: false, error: 'Invalid hex color format' };
  }

  return { valid: true };
};

/**
 * Check if tag name is unique
 */
const isTagNameUnique = (name: string, existingTags: Tags[], excludeId?: string): boolean => {
  const normalizedName = name.trim().toLowerCase();
  return !existingTags.some(
    (tag) => tag.name.toLowerCase() === normalizedName && tag.id !== excludeId
  );
};

/**
 * Get tasks by tag
 */
const getTasksByTag = (tasks: Task[], tagId: string): Task[] => {
  return tasks.filter((task) => task.tags.some((tag) => tag.id === tagId));
};

/**
 * Get tag usage count
 */
const getTagUsageCount = (tasks: Task[], tagId: string): number => {
  return tasks.filter((task) => task.tags.some((tag) => tag.id === tagId)).length;
};

/**
 * Check if task has tag
 */
const taskHasTag = (task: Task, tagId: string): boolean => {
  return task.tags.some((tag) => tag.id === tagId);
};

/**
 * Get all unique tags from tasks
 */
const getAllTagsFromTasks = (tasks: Task[]): Tags[] => {
  const tagMap = new Map<string, Tags>();

  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      if (!tagMap.has(tag.id)) {
        tagMap.set(tag.id, tag);
      }
    });
  });

  return Array.from(tagMap.values());
};

describe('Tag Logic', () => {
  describe('filterTasksByTag', () => {
    it('should return all tasks when tagId is null', () => {
      const result = filterTasksByTag(mockTasks, null);
      expect(result).toHaveLength(mockTasks.length);
      expect(result).toEqual(mockTasks);
    });

    it('should filter tasks by specific tag', () => {
      const result = filterTasksByTag(mockTasks, '1'); // Frontend tag
      expect(result).toHaveLength(2); // Task 1 and Task 3
      expect(result.every((task) => task.tags.some((tag) => tag.id === '1'))).toBe(true);
    });

    it('should return empty array when no tasks have the tag', () => {
      const result = filterTasksByTag(mockTasks, '999'); // Non-existent tag
      expect(result).toHaveLength(0);
    });

    it('should include tasks with multiple tags if one matches', () => {
      const result = filterTasksByTag(mockTasks, '2'); // Backend tag
      expect(result).toHaveLength(2); // Task 2 and Task 3
      expect(result.find((t) => t.id === '3')).toBeDefined(); // Task 3 has both Frontend and Backend
    });

    it('should not include tasks with no tags', () => {
      const result = filterTasksByTag(mockTasks, '1');
      expect(result.find((t) => t.id === '5')).toBeUndefined(); // Task 5 has no tags
    });
  });

  describe('validateTagName', () => {
    it('should accept valid tag name', () => {
      const result = validateTagName('Frontend');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty tag name', () => {
      const result = validateTagName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject whitespace-only tag name', () => {
      const result = validateTagName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject tag name with less than 2 characters', () => {
      const result = validateTagName('A');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 2 characters');
    });

    it('should reject tag name with more than 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = validateTagName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('less than 50 characters');
    });

    it('should accept tag name with exactly 2 characters', () => {
      const result = validateTagName('AB');
      expect(result.valid).toBe(true);
    });

    it('should accept tag name with exactly 50 characters', () => {
      const name = 'A'.repeat(50);
      const result = validateTagName(name);
      expect(result.valid).toBe(true);
    });

    it('should trim whitespace before validation', () => {
      const result = validateTagName('  Valid Tag  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTagColor', () => {
    it('should accept valid 6-digit hex color', () => {
      const result = validateTagColor('#FF5733');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid 3-digit hex color', () => {
      const result = validateTagColor('#F57');
      expect(result.valid).toBe(true);
    });

    it('should accept lowercase hex color', () => {
      const result = validateTagColor('#ff5733');
      expect(result.valid).toBe(true);
    });

    it('should reject empty color', () => {
      const result = validateTagColor('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject color without hash', () => {
      const result = validateTagColor('FF5733');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid hex color');
    });

    it('should reject invalid hex characters', () => {
      const result = validateTagColor('#GG5733');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid hex color');
    });

    it('should reject invalid length', () => {
      const result = validateTagColor('#FF573');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid hex color');
    });

    it('should accept all predefined tag colors', () => {
      TASK_TAG_COLORS.forEach((color) => {
        const result = validateTagColor(color);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('isTagNameUnique', () => {
    it('should return true when tag name is unique', () => {
      const result = isTagNameUnique('NewTag', mockTags);
      expect(result).toBe(true);
    });

    it('should return false when tag name already exists', () => {
      const result = isTagNameUnique('Frontend', mockTags);
      expect(result).toBe(false);
    });

    it('should be case-insensitive', () => {
      const result = isTagNameUnique('frontend', mockTags);
      expect(result).toBe(false);
    });

    it('should trim whitespace before comparison', () => {
      const result = isTagNameUnique('  Frontend  ', mockTags);
      expect(result).toBe(false);
    });

    it('should allow same name when editing (excludeId provided)', () => {
      const result = isTagNameUnique('Frontend', mockTags, '1');
      expect(result).toBe(true);
    });

    it('should still check uniqueness against other tags when editing', () => {
      const result = isTagNameUnique('Backend', mockTags, '1');
      expect(result).toBe(false);
    });
  });

  describe('getTasksByTag', () => {
    it('should return all tasks with specific tag', () => {
      const result = getTasksByTag(mockTasks, '1'); // Frontend
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toEqual(['1', '3']);
    });

    it('should return empty array when tag is not used', () => {
      const result = getTasksByTag(mockTasks, '999');
      expect(result).toHaveLength(0);
    });

    it('should include tasks with multiple tags', () => {
      const result = getTasksByTag(mockTasks, '2'); // Backend
      expect(result).toHaveLength(2);
      expect(result.find((t) => t.id === '3')).toBeDefined();
    });
  });

  describe('getTagUsageCount', () => {
    it('should count tasks using a specific tag', () => {
      expect(getTagUsageCount(mockTasks, '1')).toBe(2); // Frontend
      expect(getTagUsageCount(mockTasks, '2')).toBe(2); // Backend
      expect(getTagUsageCount(mockTasks, '3')).toBe(1); // Bug
      expect(getTagUsageCount(mockTasks, '4')).toBe(0); // Feature (not used)
    });

    it('should return 0 for non-existent tag', () => {
      const result = getTagUsageCount(mockTasks, '999');
      expect(result).toBe(0);
    });

    it('should count tasks with multiple tags correctly', () => {
      // Task 3 has both Frontend (1) and Backend (2)
      expect(getTagUsageCount(mockTasks, '1')).toBe(2);
      expect(getTagUsageCount(mockTasks, '2')).toBe(2);
    });
  });

  describe('taskHasTag', () => {
    it('should return true when task has the tag', () => {
      expect(taskHasTag(mockTasks[0], '1')).toBe(true); // Task 1 has Frontend
    });

    it('should return false when task does not have the tag', () => {
      expect(taskHasTag(mockTasks[0], '2')).toBe(false); // Task 1 doesn't have Backend
    });

    it('should return true when task has multiple tags including the one checked', () => {
      expect(taskHasTag(mockTasks[2], '1')).toBe(true); // Task 3 has Frontend
      expect(taskHasTag(mockTasks[2], '2')).toBe(true); // Task 3 has Backend
    });

    it('should return false for task with no tags', () => {
      expect(taskHasTag(mockTasks[4], '1')).toBe(false); // Task 5 has no tags
    });
  });

  describe('getAllTagsFromTasks', () => {
    it('should extract all unique tags from tasks', () => {
      const result = getAllTagsFromTasks(mockTasks);
      expect(result).toHaveLength(3); // Frontend, Backend, Bug (Feature is not used)
      expect(result.map((t) => t.id).sort()).toEqual(['1', '2', '3']);
    });

    it('should not duplicate tags used in multiple tasks', () => {
      const result = getAllTagsFromTasks(mockTasks);
      const frontendTags = result.filter((t) => t.id === '1');
      expect(frontendTags).toHaveLength(1);
    });

    it('should return empty array for tasks with no tags', () => {
      const tasksWithNoTags = [mockTasks[4]];
      const result = getAllTagsFromTasks(tasksWithNoTags);
      expect(result).toHaveLength(0);
    });

    it('should preserve tag properties', () => {
      const result = getAllTagsFromTasks(mockTasks);
      const frontendTag = result.find((t) => t.id === '1');
      expect(frontendTag).toBeDefined();
      expect(frontendTag?.name).toBe('Frontend');
      expect(frontendTag?.color).toBe('#FF5733');
    });
  });

  describe('Tag Color Constants', () => {
    it('should have predefined tag colors', () => {
      expect(TASK_TAG_COLORS).toBeDefined();
      expect(Array.isArray(TASK_TAG_COLORS)).toBe(true);
      expect(TASK_TAG_COLORS.length).toBeGreaterThan(0);
    });

    it('should have valid hex colors', () => {
      TASK_TAG_COLORS.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have unique colors', () => {
      const uniqueColors = new Set(TASK_TAG_COLORS);
      expect(uniqueColors.size).toBe(TASK_TAG_COLORS.length);
    });
  });

  describe('Tag Assignment Edge Cases', () => {
    it('should handle task with duplicate tag IDs gracefully', () => {
      const taskWithDuplicates: Task = {
        ...mockTasks[0],
        tags: [mockTags[0], mockTags[0]], // Duplicate Frontend tag
      };

      expect(taskHasTag(taskWithDuplicates, '1')).toBe(true);
      expect(getTagUsageCount([taskWithDuplicates], '1')).toBe(1);
    });

    it('should handle empty task array', () => {
      expect(filterTasksByTag([], '1')).toHaveLength(0);
      expect(getTasksByTag([], '1')).toHaveLength(0);
      expect(getTagUsageCount([], '1')).toBe(0);
      expect(getAllTagsFromTasks([])).toHaveLength(0);
    });

    it('should handle task with undefined tags array', () => {
      const taskWithoutTags = {
        ...mockTasks[0],
        tags: undefined as any,
      };

      expect(() => taskHasTag(taskWithoutTags, '1')).not.toThrow();
    });
  });
});
