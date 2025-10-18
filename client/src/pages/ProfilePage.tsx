/**
 * Page de profil utilisateur
 * Conforme référentiel DWWM 2023
 */

import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Profil</h1>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Chargement du profil...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
