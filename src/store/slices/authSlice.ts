import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { getErrorMessage } from '@/utils/errors';
// State interface
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
  accessToken: null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.USER),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: unknown) {
      let message = 'Login failed';
      if (typeof error === 'string') message = error;
      else if (error instanceof Error) message = error.message;
      else if (typeof error === 'object' && error !== null && 'message' in error) message = String((error as {message: unknown}).message);
      
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const getProfile = createAsyncThunk('auth/profile', async () => {
  const response = await authService.getProfile();
  return response.data;
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = null; // Access token handled by cookie
      state.isAuthenticated = true;
      
      // Store user info for UI persistence
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.accessToken = null; // Access token handled by cookie
        state.isAuthenticated = true;
        
        // Store user info
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.data.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Do not set user/token on register as email verification is required
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Registration failed';
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Force reload to ensure all states are cleared
        window.location.reload();
      });

    // Get Profile
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
        }
      });
  },
});

export const { setCredentials, clearCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
