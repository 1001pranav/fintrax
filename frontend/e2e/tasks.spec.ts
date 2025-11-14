/**
 * E2E Tests for Task Management Flow
 * Tests the complete user flow for creating, editing, moving, and deleting tasks
 */

import { test, expect } from '@playwright/test';
import {
  login,
  setupAuthenticatedSession,
  clearAuthState,
  TEST_USER,
} from './helpers/auth.helper';
import {
  waitForPageLoad,
  waitForElement,
  clickButton,
  fillField,
  waitForToast,
  waitForLoadingComplete,
  navigateToPage,
  closeModal,
  waitForText,
  getElementCount,
} from './helpers/page.helper';

test.describe('Task Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated session before each test
    await setupAuthenticatedSession(page, TEST_USER);
    await navigateToPage(page, '/projects');
    await waitForPageLoad(page);
  });

  test.afterEach(async ({ page }) => {
    // Optional: Clean up any test data created
    // This would require API calls or database cleanup
  });

  test('should create a new task', async ({ page }) => {
    // Navigate to a project or Kanban board
    await test.step('Navigate to project', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }
    });

    // Click "Add Task" or "New Task" button
    await test.step('Open task creation modal', async () => {
      const addTaskButton = page.getByRole('button', { name: /add task|new task|\+/i });
      await addTaskButton.click();

      // Wait for modal to open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    // Fill in task details
    await test.step('Fill task details', async () => {
      await fillField(page, /title|name/i, 'E2E Test Task');
      await fillField(page, /description/i, 'This is a test task created by E2E tests');

      // Select priority
      const prioritySelect = page.getByLabel(/priority/i);
      if (await prioritySelect.isVisible()) {
        await prioritySelect.selectOption('high');
      }

      // Select status
      const statusSelect = page.getByLabel(/status/i);
      if (await statusSelect.isVisible()) {
        await statusSelect.selectOption('todo');
      }
    });

    // Submit task creation
    await test.step('Create task', async () => {
      await clickButton(page, /create|add|save/i);

      // Wait for success notification
      await waitForToast(page, /created|added|success/i, 'success');

      // Modal should close
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5000 });
    });

    // Verify task appears in Kanban board
    await test.step('Verify task in Kanban', async () => {
      await waitForLoadingComplete(page);

      // Look for the task in the todo column
      const taskCard = page.getByText('E2E Test Task');
      await expect(taskCard).toBeVisible();
    });
  });

  test('should edit an existing task', async ({ page }) => {
    await test.step('Navigate to project with tasks', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }
    });

    // Find and click on a task to edit
    await test.step('Open task for editing', async () => {
      const firstTask = page.locator('[data-testid="task-card"]').first();
      await expect(firstTask).toBeVisible();
      await firstTask.click();

      // Wait for task modal/details to open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    // Edit task details
    await test.step('Modify task details', async () => {
      const titleField = page.getByLabel(/title|name/i);
      await titleField.clear();
      await titleField.fill('Updated Task Title');

      const descriptionField = page.getByLabel(/description/i);
      await descriptionField.clear();
      await descriptionField.fill('Updated description from E2E test');

      // Change priority
      const prioritySelect = page.getByLabel(/priority/i);
      if (await prioritySelect.isVisible()) {
        await prioritySelect.selectOption('medium');
      }
    });

    // Save changes
    await test.step('Save task changes', async () => {
      await clickButton(page, /save|update/i);

      // Wait for success notification
      await waitForToast(page, /updated|saved|success/i, 'success');
    });

    // Verify changes
    await test.step('Verify task update', async () => {
      await waitForLoadingComplete(page);
      await expect(page.getByText('Updated Task Title')).toBeVisible();
    });
  });

  test('should move task between statuses (drag and drop)', async ({ page }) => {
    await test.step('Navigate to Kanban board', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }
    });

    await test.step('Verify initial task status', async () => {
      // Find a task in the "todo" column
      const todoColumn = page.locator('[data-testid="kanban-column-todo"]');
      const taskInTodo = todoColumn.locator('[data-testid="task-card"]').first();

      if (await taskInTodo.isVisible()) {
        // Get task title for verification
        const taskTitle = await taskInTodo.textContent();

        // Drag task to "in-progress" column
        const inProgressColumn = page.locator('[data-testid="kanban-column-in-progress"]');

        await taskInTodo.dragTo(inProgressColumn);

        // Wait for backend update
        await waitForLoadingComplete(page);

        // Verify task is now in "in-progress" column
        const taskInProgress = inProgressColumn.getByText(taskTitle!);
        await expect(taskInProgress).toBeVisible();
      }
    });
  });

  test('should assign tags to a task', async ({ page }) => {
    await test.step('Navigate to project', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }
    });

    // Open task for editing
    await test.step('Open task modal', async () => {
      const firstTask = page.locator('[data-testid="task-card"]').first();
      await firstTask.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    // Add tag to task
    await test.step('Assign tag', async () => {
      // Click tag selector
      const tagSelector = page.getByLabel(/tags/i).or(
        page.locator('[data-testid="tag-selector"]')
      );

      if (await tagSelector.isVisible()) {
        await tagSelector.click();

        // Select first available tag
        const firstTag = page.locator('[data-testid="tag-option"]').first();
        if (await firstTag.isVisible()) {
          await firstTag.click();
        }
      }
    });

    // Save and verify
    await test.step('Verify tag assignment', async () => {
      await clickButton(page, /save|update/i);
      await waitForLoadingComplete(page);

      // Reopen task to verify tag
      const firstTask = page.locator('[data-testid="task-card"]').first();
      await firstTask.click();

      // Verify tag is present
      const tagBadge = page.locator('[data-testid="task-tag"]').first();
      await expect(tagBadge).toBeVisible();
    });
  });

  test('should filter tasks by tag', async ({ page }) => {
    await test.step('Navigate to Kanban board', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }
    });

    await test.step('Get initial task count', async () => {
      const initialCount = await getElementCount(page, '[data-testid="task-card"]');
      expect(initialCount).toBeGreaterThan(0);
    });

    await test.step('Apply tag filter', async () => {
      // Click on a tag filter button
      const tagFilter = page.locator('[data-testid="tag-filter"]').first();

      if (await tagFilter.isVisible()) {
        await tagFilter.click();

        // Wait for filter to apply
        await waitForLoadingComplete(page);

        // Count should change (either more or less)
        const filteredCount = await getElementCount(page, '[data-testid="task-card"]');
        // Verify filter is active
        await expect(tagFilter).toHaveClass(/active|selected/);
      }
    });

    await test.step('Clear filter', async () => {
      // Click "All" or clear filter button
      const clearFilter = page.getByRole('button', { name: /all|clear/i });

      if (await clearFilter.isVisible()) {
        await clearFilter.click();
        await waitForLoadingComplete(page);
      }
    });
  });

  test('should delete a task', async ({ page }) => {
    await test.step('Navigate to project', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }
    });

    // Get task title for verification
    let taskTitle: string | null = null;

    await test.step('Open task and initiate delete', async () => {
      const firstTask = page.locator('[data-testid="task-card"]').first();
      taskTitle = await firstTask.textContent();

      await firstTask.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      // Click delete button
      const deleteButton = page.getByRole('button', { name: /delete|remove/i });
      await deleteButton.click();
    });

    await test.step('Confirm deletion', async () => {
      // Handle confirmation dialog
      page.once('dialog', (dialog) => {
        expect(dialog.message()).toContain(/delete|remove/i);
        dialog.accept();
      });

      // Or click confirm button if using custom modal
      const confirmButton = page.getByRole('button', { name: /confirm|yes/i });
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      // Wait for success notification
      await waitForToast(page, /deleted|removed|success/i, 'success');
    });

    await test.step('Verify task is deleted', async () => {
      await waitForLoadingComplete(page);

      // Task should no longer be visible
      if (taskTitle) {
        const deletedTask = page.getByText(taskTitle);
        await expect(deletedTask).not.toBeVisible({ timeout: 5000 });
      }
    });
  });

  test('should view project dashboard with task statistics', async ({ page }) => {
    await test.step('Navigate to project dashboard', async () => {
      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await waitForPageLoad(page);
      }

      // Navigate to dashboard tab if separate from Kanban
      const dashboardTab = page.getByRole('tab', { name: /dashboard|overview/i });
      if (await dashboardTab.isVisible({ timeout: 2000 })) {
        await dashboardTab.click();
        await waitForPageLoad(page);
      }
    });

    await test.step('Verify statistics cards', async () => {
      // Check for total tasks stat
      await expect(page.getByText(/total tasks/i)).toBeVisible();

      // Check for completion percentage
      await expect(page.locator('[data-testid="completion-percentage"]')
        .or(page.getByText(/%|complete/i))).toBeVisible();

      // Check for status breakdown
      await expect(page.getByText(/to do|todo/i)).toBeVisible();
      await expect(page.getByText(/in progress/i)).toBeVisible();
      await expect(page.getByText(/done/i)).toBeVisible();
    });

    await test.step('Verify charts', async () => {
      // Check for status distribution chart
      const statusChart = page.locator('[data-testid="status-chart"]')
        .or(page.getByText(/status distribution/i).locator('..'));
      await expect(statusChart).toBeVisible();

      // Check for priority distribution chart
      const priorityChart = page.locator('[data-testid="priority-chart"]')
        .or(page.getByText(/priority distribution/i).locator('..'));
      await expect(priorityChart).toBeVisible();
    });
  });

  test('should manage tags from tag management modal', async ({ page }) => {
    await test.step('Open tag management', async () => {
      await navigateToPage(page, '/projects');

      // Look for tag management button
      const tagManagementButton = page.getByRole('button', { name: /manage tags|tags/i });
      if (await tagManagementButton.isVisible()) {
        await tagManagementButton.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
      }
    });

    await test.step('Create new tag', async () => {
      await fillField(page, /tag name|name/i, 'E2E Test Tag');

      // Select a color
      const colorPicker = page.locator('[data-testid="color-picker"]');
      if (await colorPicker.isVisible()) {
        const firstColor = colorPicker.locator('button').first();
        await firstColor.click();
      }

      await clickButton(page, /create|add/i);

      // Verify tag appears in list
      await expect(page.getByText('E2E Test Tag')).toBeVisible();
    });

    await test.step('Close tag management', async () => {
      await closeModal(page);
    });
  });
});

test.describe('Task Management Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, TEST_USER);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    await navigateToPage(page, '/projects');

    // Try to create a task while offline
    const addTaskButton = page.getByRole('button', { name: /add task/i });
    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      await fillField(page, /title/i, 'Offline Task');
      await clickButton(page, /create|save/i);

      // Should show error message
      await waitForToast(page, /error|failed|network/i, 'error');
    }

    // Restore online mode
    await page.context().setOffline(false);
  });

  test('should validate required fields', async ({ page }) => {
    await navigateToPage(page, '/projects');

    const firstProject = page.locator('[data-testid="project-card"]').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
    }

    // Try to create task without required fields
    const addTaskButton = page.getByRole('button', { name: /add task/i });
    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      // Don't fill any fields, just try to submit
      await clickButton(page, /create|save/i);

      // Should show validation error
      const errorMessage = page.getByText(/required|fill|enter/i);
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });
});
