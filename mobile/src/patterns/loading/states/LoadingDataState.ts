/**
 * LoadingDataState - Loading data for the first time
 * Concrete implementation of LoadingState
 * Part of the State Pattern implementation
 */

import { LoadingState, LoadingStateData } from './LoadingState';

export class LoadingDataState implements LoadingState {
  private message: string;

  constructor(message: string = 'Loading...') {
    this.message = message;
  }

  getName(): string {
    return 'loading';
  }

  onEnter(): void {
    console.log('[LoadingDataState] Entering loading state');
  }

  canLoad(): boolean {
    return false;
  }

  canRefresh(): boolean {
    return false;
  }

  isError(): boolean {
    return false;
  }

  isLoading(): boolean {
    return true;
  }

  getData(): LoadingStateData {
    return {
      message: this.message,
    };
  }
}
