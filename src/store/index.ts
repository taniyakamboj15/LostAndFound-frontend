import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['items/create/pending'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.photos'],
        // Ignore these paths in the state
        ignoredPaths: ['items.selectedItem.photos'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
