/**
 * API d'authentification
 * Conforme référentiel DWWM 2023
 */

import { User } from "../../store/slices/authSlice";
import { api } from "./apiClient";

// Types pour les requêtes
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API d'authentification
export const authAPI = {
  // Connexion
  login: async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Inscription
  register: async (userData: RegisterRequest) => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: async () => {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data;
  },

  // Rafraîchir le token
  refreshToken: async () => {
    const response = await api.post<AuthResponse>("/auth/refresh");
    return response.data;
  },

  // Demander une réinitialisation de mot de passe
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Réinitialiser le mot de passe
  resetPassword: async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Vérifier l'email
  verifyEmail: async (token: string) => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  // Renvoyer l'email de vérification
  resendVerificationEmail: async () => {
    const response = await api.post("/auth/resend-verification");
    return response.data;
  },
};
