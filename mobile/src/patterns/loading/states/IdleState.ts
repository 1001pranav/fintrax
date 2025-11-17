/**
 * IdleState - Initial state before any loading
 * Concrete implementation of LoadingState
 * Part of the State Pattern implementation
 */

import { LoadingState, LoadingStateData } from './LoadingState';

export class IdleState implements LoadingState {
  getName(): string {
    return 'idle';
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
