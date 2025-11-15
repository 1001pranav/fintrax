import { describe, it, expect } from '@jest/globals';
import { useFinanceStore } from '../financeStore';

describe('useFinanceStore - Basic Tests', () => {
  it('should have initial state', () => {
    const state = useFinanceStore.getState();
    expect(state).toBeDefined();
    expect(state.financialData).toBeDefined();
    expect(state.balance).toBeDefined();
  });
});
