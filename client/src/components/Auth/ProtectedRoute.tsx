/**
 * Route protégée pour l'authentification
 * Conforme référentiel DWWM 2023
 */

import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Afficher le spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          text="Vérification de l'authentification..."
        />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rendre les enfants si authentifié
  return <>{children}</>;
};

export default ProtectedRoute;



