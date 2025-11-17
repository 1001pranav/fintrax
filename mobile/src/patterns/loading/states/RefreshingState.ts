/**
 * RefreshingState - Refreshing already loaded data
 * Concrete implementation of LoadingState
 * Part of the State Pattern implementation
 */

import { LoadingState, LoadingStateData } from './LoadingState';

export class RefreshingState implements LoadingState {
  getName(): string {
    return 'refreshing';
  }

  onEnter(): void {
    console.log('[RefreshingState] Refreshing data');
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
      message: 'Refreshing...',
    };
  }
}
