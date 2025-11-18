/**
 * Sync Middleware
 * Redux middleware for automatic data synchronization
 * Implements Observer Pattern
 */

import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { offlineManager } from '../../services';
import { logout } from '../slices/authSlice';

/**
 * Sync middleware that triggers sync on data changes
 */
export const syncMiddleware: Middleware = (store) => (next) => (action) => {
  const typedAction = action as AnyAction;
  const result = next(action);

  // List of actions that should trigger sync
  const syncActions = [
    'tasks/createTask/fulfilled',
    'tasks/updateTask/fulfilled',
    'tasks/deleteTask/fulfilled',
    'projects/createProject/fulfilled',
    'projects/updateProject/fulfilled',
    'projects/deleteProject/fulfilled',
    'finance/createTransaction/fulfilled',
    'finance/updateTransaction/fulfilled',
    'finance/deleteTransaction/fulfilled',
  ];

  // Trigger sync if action matches
  if (syncActions.includes(typedAction.type)) {
    // Trigger sync in background (don't await)
    offlineManager.syncAll().catch((error) => {
      console.error('Background sync failed:', error);
    });
  }

  // Clear local data on logout
  if (logout.fulfilled.match(typedAction)) {
    // Clear local database
    const { sqliteService } = require('../../services/storage');
    sqliteService.clearAll().catch((error: Error) => {
      console.error('Failed to clear local database:', error);
    });
  }

  return result;
};
