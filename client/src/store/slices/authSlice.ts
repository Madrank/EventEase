/**
 * Slice Redux pour l'authentification
 * Conforme référentiel DWWM 2023
 */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api/authAPI";

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// État initial
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Actions asynchrones
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.data?.token || "");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Erreur de connexion",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem("token", response.data?.token || "");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Erreur d'inscription",
      );
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data?.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
          "Erreur de récupération du profil",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      return true;
    } catch (error: any) {
      // Même en cas d'erreur, on déconnecte localement
      localStorage.removeItem("token");
      return true;
    }
  },
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
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
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });
  },
});

// Actions
export const { clearError, setCredentials, clearCredentials } =
  authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Reducer
export default authSlice.reducer;
