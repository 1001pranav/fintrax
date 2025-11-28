/**
 * LoadingContext - Context for managing loading states
 * Part of the State Pattern implementation
 * Manages state transitions and provides state access
 */

import { LoadingState, LoadingStateData } from './states/LoadingState';
import { IdleState } from './states/IdleState';
import { LoadingDataState } from './states/LoadingDataState';
import { RefreshingState } from './states/RefreshingState';
import { SuccessState } from './states/SuccessState';
import { ErrorState } from './states/ErrorState';

export type LoadingStateName = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

export class LoadingContext {
  private currentState: LoadingState;
  private listeners: ((state: LoadingState) => void)[] = [];

  constructor(initialState?: LoadingState) {
    this.currentState = initialState || new IdleState();
  }

  /**
   * Get current state
   */
  getState(): LoadingState {
    return this.currentState;
  }

  /**
   * Get current state name
   */
  getStateName(): LoadingStateName {
    return this.currentState.getName() as LoadingStateName;
  }

  /**
   * Get state data
   */
  getStateData(): LoadingStateData {
    return this.currentState.getData();
  }

  /**
   * Transition to a new state
   */
  setState(newState: LoadingState): void {
    // Call onExit on current state
    if (this.currentState.onExit) {
      this.currentState.onExit(this);
    }

    // Transition to new state
    this.currentState = newState;

    // Call onEnter on new state
    if (this.currentState.onEnter) {
      this.currentState.onEnter(this);
    }

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Transition to idle state
   */
  toIdle(): void {
    this.setState(new IdleState());
  }

  /**
   * Transition to loading state
   */
  toLoading(message?: string): void {
    if (this.currentState.canLoad()) {
      this.setState(new LoadingDataState(message));
    }
  }

  /**
   * Transition to refreshing state
   */
  toRefreshing(): void {
    if (this.currentState.canRefresh()) {
      this.setState(new RefreshingState());
    }
  }

  /**
   * Transition to success state
   */
  toSuccess(): void {
    this.setState(new SuccessState());
  }

  /**
   * Transition to error state
   */
  toError(error: string): void {
    this.setState(new ErrorState(error));
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.currentState.isLoading();
  }

  /**
   * Check if in error state
   */
  isError(): boolean {
    return this.currentState.isError();
  }

  /**
   * Check if can load
   */
  canLoad(): boolean {
    return this.currentState.canLoad();
  }

  /**
   * Check if can refresh
   */
  canRefresh(): boolean {
    return this.currentState.canRefresh();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentState);
      } catch (error) {
        console.error('[LoadingContext] Error in listener:', error);
      }
    });
  }
}
