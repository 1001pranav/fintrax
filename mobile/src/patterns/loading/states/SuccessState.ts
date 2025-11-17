/**
 * SuccessState - Data loaded successfully
 * Concrete implementation of LoadingState
 * Part of the State Pattern implementation
 */

import { LoadingState, LoadingStateData } from './LoadingState';

export class SuccessState implements LoadingState {
  getName(): string {
    return 'success';
  }

  onEnter(): void {
    console.log('[SuccessState] Data loaded successfully');
  }

  canLoad(): boolean {
    return true;
  }

  canRefresh(): boolean {
    return true;
  }

  isError(): boolean {
    return false;
  }

  isLoading(): boolean {
    return false;
  }

  getData(): LoadingStateData {
    return {};
  }
}
