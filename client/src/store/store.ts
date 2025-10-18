/**
 * Configuration du store Redux
 * Conforme référentiel DWWM 2023
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import authSlice from "./slices/authSlice";
import eventSlice from "./slices/eventSlice";
import providerSlice from "./slices/providerSlice";
import uiSlice from "./slices/uiSlice";
import venueSlice from "./slices/venueSlice";

// Configuration de persistance
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Seul l'auth est persisté
  blacklist: ["ui"], // UI n'est pas persisté
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

// Combinaison des reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  events: eventSlice,
  ui: uiSlice,
  providers: providerSlice,
  venues: venueSlice,
});

// Store principal
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor pour la persistance
export const persistor = persistStore(store);

// Types TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks typés
export { useAppDispatch, useAppSelector } from "./hooks";



