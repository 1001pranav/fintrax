import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@api';
import { tokenStorage, asyncStorage, STORAGE_KEYS } from '@utils/storage';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@app-types/api.types';

/**
 * Auth State Interface
 */
export interface AuthState {
  user: {
    id: number | null;
    email: string | null;
    username: string | null;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricEnabled: boolean;
}

/**
 * Initial State
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricEnabled: false,
};

/**
 * Async Thunks
 */

// Login
export const login = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      // Save token to secure storage
      await tokenStorage.saveToken(response.token);

      // Save user info to AsyncStorage
      await asyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user_id.toString());
      await asyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.email);
      await asyncStorage.setItem(STORAGE_KEYS.USER_NAME, response.username);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register
export const register = createAsyncThunk<LoginResponse, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);

      // Save token to secure storage
      await tokenStorage.saveToken(response.token);

      // Save user info to AsyncStorage
      await asyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user_id.toString());
      await asyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.email);
      await asyncStorage.setItem(STORAGE_KEYS.USER_NAME, response.username);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout API (optional, for server-side cleanup)
      try {
        await authApi.logout();
      } catch {
        // Ignore logout API errors, proceed with local cleanup
        console.log('Logout API call failed, proceeding with local cleanup');
      }

      // Clear token from secure storage
      await tokenStorage.removeToken();

      // Clear user info from AsyncStorage
      await asyncStorage.removeItem(STORAGE_KEYS.USER_ID);
      await asyncStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      await asyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Load user from storage (on app start)
export const loadUserFromStorage = createAsyncThunk<
  { user: AuthState['user']; token: string },
  void,
  { rejectValue: string }
>('auth/loadUserFromStorage', async (_, { rejectWithValue }) => {
  try {
    const token = await tokenStorage.getToken();

    if (!token) {
      return rejectWithValue('No token found');
    }

    const userId = await asyncStorage.getItem(STORAGE_KEYS.USER_ID);
    const email = await asyncStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    const username = await asyncStorage.getItem(STORAGE_KEYS.USER_NAME);

    if (!userId || !email || !username) {
      return rejectWithValue('Incomplete user data');
    }

    return {
      user: {
        id: parseInt(userId, 10),
        email,
        username,
      },
      token,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to load user');
  }
});

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set biometric enabled
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },

    // Update user info
    updateUser: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Force logout (e.g., on 401 error)
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.user_id,
          email: action.payload.email,
          username: action.payload.username,
        };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.user_id,
          email: action.payload.email,
          username: action.payload.username,
        };
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || 'Registration failed';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        // Still clear auth state even if logout fails
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || null;
      });

    // Load user from storage
    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

// Export actions
export const { clearError, setBiometricEnabled, updateUser, forceLogout } = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Export reducer
export default authSlice.reducer;
