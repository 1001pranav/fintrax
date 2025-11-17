/**
 * useLoadingState Hook
 * Custom React hook for managing loading states using State Pattern
 * Provides easy access to LoadingContext in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { LoadingContext, LoadingStateName } from '../patterns/loading/LoadingContext';
import { LoadingStateData } from '../patterns/loading/states/LoadingState';

export interface UseLoadingStateReturn {
  stateName: LoadingStateName;
  stateData: LoadingStateData;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  canLoad: boolean;
  canRefresh: boolean;
  setLoading: (message?: string) => void;
  setRefreshing: () => void;
  setSuccess: () => void;
  setError: (error: string) => void;
  setIdle: () => void;
}

export const useLoadingState = (initialState?: LoadingStateName): UseLoadingStateReturn => {
  const contextRef = useRef<LoadingContext>(new LoadingContext());
  const context = contextRef.current;

  const [stateName, setStateName] = useState<LoadingStateName>(
    initialState || context.getStateName()
  );
  const [stateData, setStateData] = useState<LoadingStateData>(context.getStateData());

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = context.subscribe((newState) => {
      setStateName(context.getStateName());
      setStateData(context.getStateData());
    });

    return () => {
      unsubscribe();
    };
  }, [context]);

  // State transition functions
  const setLoading = useCallback(
    (message?: string) => {
      context.toLoading(message);
    },
    [context]
  );

  const setRefreshing = useCallback(() => {
    context.toRefreshing();
  }, [context]);

  const setSuccess = useCallback(() => {
    context.toSuccess();
  }, [context]);

  const setError = useCallback(
    (error: string) => {
      context.toError(error);
    },
    [context]
  );

  const setIdle = useCallback(() => {
    context.toIdle();
  }, [context]);

  return {
    stateName,
    stateData,
    isLoading: stateName === 'loading',
    isRefreshing: stateName === 'refreshing',
    isError: stateName === 'error',
    canLoad: context.canLoad(),
    canRefresh: context.canRefresh(),
    setLoading,
    setRefreshing,
    setSuccess,
    setError,
    setIdle,
  };
};
