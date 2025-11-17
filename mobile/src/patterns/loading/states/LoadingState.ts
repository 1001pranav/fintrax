/**
 * LoadingState Interface
 * Part of the State Pattern implementation
 * Defines the contract for all loading states
 */

import { ReactElement } from 'react';

export interface LoadingStateData {
  error?: string;
  message?: string;
  progress?: number;
}

export interface LoadingState {
  /**
   * Get the name of this state
   */
  getName(): string;

  /**
   * Handle entering this state
   * @param context - Loading context
   */
  onEnter?(context: any): void;

  /**
   * Handle exiting this state
   * @param context - Loading context
   */
  onExit?(context: any): void;

  /**
   * Check if data can be loaded in this state
   */
  canLoad(): boolean;

  /**
   * Check if refresh is allowed in this state
   */
  canRefresh(): boolean;

  /**
   * Check if this is an error state
   */
  isError(): boolean;

  /**
   * Check if this is a loading state
   */
  isLoading(): boolean;

  /**
   * Get data for rendering
   */
  getData(): LoadingStateData;
}
