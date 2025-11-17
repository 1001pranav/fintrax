import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/index';

/**
 * Custom hook for typed dispatch
 * Use throughout the app instead of plain `useDispatch`
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(login({ email, password }));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
