// ============================================================
// 1. UPDATE: src/store/store.ts
// ============================================================
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../lib/api/baseApi';

export const store = configureStore({
  reducer: {
    // Add the baseApi reducer
    [baseApi.reducerPath]: baseApi.reducer,
    // Add your other reducers here if you have any
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;