/**
 * Contexte d'authentification
 * Conforme référentiel DWWM 2023
 */

import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getCurrentUser,
  selectIsAuthenticated,
  selectUser,
} from "../store/slices/authSlice";

// Types
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
}

// Contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props du provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



