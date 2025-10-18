/**
 * Slice Redux pour la gestion de l'interface utilisateur
 * Conforme référentiel DWWM 2023
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }>;
  loading: {
    global: boolean;
    auth: boolean;
    events: boolean;
    providers: boolean;
  };
}

const initialState: UIState = {
  theme: "light",
  sidebarOpen: false,
  mobileMenuOpen: false,
  notifications: [],
  loading: {
    global: false,
    auth: false,
    events: false,
    providers: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<
        Omit<UIState["notifications"][0], "id" | "timestamp">
      >,
    ) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (
      state,
      action: PayloadAction<{ key: keyof UIState["loading"]; value: boolean }>,
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
