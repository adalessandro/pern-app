import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useIsLoading = (): boolean => {
    const isLoading = useAppSelector((state) => {
      return Object.values(state.api.queries).some((query) => {
        return query && query.status === QueryStatus.pending;
      });
    });
    return isLoading;
  }
  
  