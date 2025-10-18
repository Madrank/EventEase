/**
 * Tests unitaires pour authSlice
 * Conforme référentiel DWWM 2023
 */

import { configureStore } from "@reduxjs/toolkit";
import authSlice, {
  clearCredentials,
  clearError,
  loginUser,
  logoutUser,
  selectAuth,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  setCredentials,
} from "../authSlice";

import { authAPI } from "../../services/api/authAPI";

// Mock de l'API
jest.mock("../../services/api/authAPI", () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

const mockAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

describe("authSlice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState();
      expect(state.auth).toEqual({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    });
  });

  describe("actions", () => {
    it("should clear error", () => {
      store.dispatch(clearError());
      const state = store.getState();
      expect(state.auth.error).toBeNull();
    });

    it("should set credentials", () => {
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER" as const,
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
      };
      const token = "test-token";

      store.dispatch(setCredentials({ user, token }));
      const state = store.getState();

      expect(state.auth.user).toEqual(user);
      expect(state.auth.token).toBe(token);
      expect(state.auth.isAuthenticated).toBe(true);
    });

    it("should clear credentials", () => {
      // First set some credentials
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER" as const,
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
      };
      store.dispatch(setCredentials({ user, token: "test-token" }));

      // Then clear them
      store.dispatch(clearCredentials());
      const state = store.getState();

      expect(state.auth.user).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.error).toBeNull();
    });
  });

  describe("async thunks", () => {
    it("should handle loginUser.pending", () => {
      store.dispatch(
        loginUser.pending("", {
          email: "test@example.com",
          password: "password",
        }),
      );
      const state = store.getState();

      expect(state.auth.isLoading).toBe(true);
      expect(state.auth.error).toBeNull();
    });

    it("should handle loginUser.fulfilled", () => {
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER" as const,
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
      };
      const token = "test-token";

      store.dispatch(
        loginUser.fulfilled({ user, token }, "", {
          email: "test@example.com",
          password: "password",
        }),
      );
      const state = store.getState();

      expect(state.auth.user).toEqual(user);
      expect(state.auth.token).toBe(token);
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.isLoading).toBe(false);
      expect(state.auth.error).toBeNull();
    });

    it("should handle loginUser.rejected", () => {
      const error = "Invalid credentials";
      store.dispatch(
        loginUser.rejected(new Error(error), "", {
          email: "test@example.com",
          password: "password",
        }),
      );
      const state = store.getState();

      expect(state.auth.isLoading).toBe(false);
      expect(state.auth.error).toBe(error);
      expect(state.auth.isAuthenticated).toBe(false);
    });

    it("should handle logoutUser.fulfilled", () => {
      // First set some credentials
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER" as const,
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
      };
      store.dispatch(setCredentials({ user, token: "test-token" }));

      // Then logout
      store.dispatch(logoutUser.fulfilled(true, ""));
      const state = store.getState();

      expect(state.auth.user).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.isLoading).toBe(false);
      expect(state.auth.error).toBeNull();
    });
  });

  describe("selectors", () => {
    it("should select auth state", () => {
      const state = store.getState();
      expect(selectAuth(state)).toEqual(state.auth);
    });

    it("should select user", () => {
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER" as const,
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
      };
      store.dispatch(setCredentials({ user, token: "test-token" }));

      const state = store.getState();
      expect(selectUser(state)).toEqual(user);
    });

    it("should select isAuthenticated", () => {
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER" as const,
        isActive: true,
        createdAt: "2023-01-01T00:00:00Z",
      };
      store.dispatch(setCredentials({ user, token: "test-token" }));

      const state = store.getState();
      expect(selectIsAuthenticated(state)).toBe(true);
    });

    it("should select loading state", () => {
      store.dispatch(
        loginUser.pending("", {
          email: "test@example.com",
          password: "password",
        }),
      );

      const state = store.getState();
      expect(selectAuthLoading(state)).toBe(true);
    });

    it("should select error state", () => {
      const error = "Test error";
      store.dispatch(
        loginUser.rejected(new Error(error), "", {
          email: "test@example.com",
          password: "password",
        }),
      );

      const state = store.getState();
      expect(selectAuthError(state)).toBe(error);
    });
  });
});



