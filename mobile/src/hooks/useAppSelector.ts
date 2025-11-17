import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@store/index';

/**
 * Custom hook for typed selector
 * Use throughout the app instead of plain `useSelector`
 *
 * @example
 * const user = useAppSelector((state) => state.auth.user);
 * const isLoading = useAppSelector(selectIsLoading);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
