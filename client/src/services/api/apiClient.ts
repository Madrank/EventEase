// API Client
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";

// Configuration de base
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Interface pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  message?: string;
}

// Configuration Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête
apiClient.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log des requêtes en développement
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  },
);

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log des réponses en développement
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data,
      );
    }

    return response;
  },
  (error) => {
    const { response } = error;

    // Log des erreurs
    console.error("❌ API Error:", error);

    // Gestion des erreurs HTTP
    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem("token");
          window.location.href = "/login";
          toast.error("Session expirée. Veuillez vous reconnecter.");
          break;

        case 403:
          toast.error(
            "Accès refusé. Vous n'avez pas les permissions nécessaires.",
          );
          break;

        case 404:
          toast.error("Ressource non trouvée.");
          break;

        case 422:
          // Erreurs de validation
          if (data?.error?.details) {
            const validationErrors = data.error.details
              .map((detail: any) => detail.msg)
              .join(", ");
            toast.error(`Erreurs de validation: ${validationErrors}`);
          } else {
            toast.error(data?.error?.message || "Données invalides.");
          }
          break;

        case 429:
          toast.error("Trop de requêtes. Veuillez patienter.");
          break;

        case 500:
          toast.error("Erreur serveur. Veuillez réessayer plus tard.");
          break;

        default:
          toast.error(data?.error?.message || "Une erreur est survenue.");
      }
    } else if (error.request) {
      // Erreur réseau
      toast.error("Problème de connexion. Vérifiez votre connexion internet.");
    } else {
      // Autre erreur
      toast.error("Une erreur inattendue est survenue.");
    }

    return Promise.reject(error);
  },
);

// Méthodes utilitaires
export const api = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.get(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.post(url, data, config),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.put(url, data, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.patch(url, data, config),

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> => apiClient.delete(url, config),
};

// Fonction pour gérer les erreurs API
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Une erreur inattendue est survenue";
};

// Fonction pour vérifier si une erreur est une erreur de validation
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 422 || error.response?.status === 400;
};

// Fonction pour extraire les erreurs de validation
export const getValidationErrors = (error: any): Record<string, string> => {
  if (!isValidationError(error)) {
    return {};
  }

  const details = error.response?.data?.error?.details;
  if (!details || !Array.isArray(details)) {
    return {};
  }

  const errors: Record<string, string> = {};
  details.forEach((detail: any) => {
    if (detail.path && detail.msg) {
      errors[detail.path] = detail.msg;
    }
  });

  return errors;
};

export default apiClient;
