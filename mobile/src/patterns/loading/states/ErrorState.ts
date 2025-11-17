/**
 * ErrorState - Error occurred during loading
 * Concrete implementation of LoadingState
 * Part of the State Pattern implementation
 */

import { LoadingState, LoadingStateData } from './LoadingState';

export class ErrorState implements LoadingState {
  private error: string;

  constructor(error: string = 'An error occurred') {
    this.error = error;
  }

  getName(): string {
    return 'error';
  }

  onEnter(): void {
    console.error('[ErrorState] Error occurred:', this.error);
  }

  canLoad(): boolean {
    return true;
  }

  canRefresh(): boolean {
    return true;
  }

  isError(): boolean {
    return true;
  }

  isLoading(): boolean {
    return false;
  }

  getData(): LoadingStateData {
    return {
      error: this.error,
    };
  }
}
