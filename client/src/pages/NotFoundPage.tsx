/**
 * Page 404 - Non trouvée
 * Conforme référentiel DWWM 2023
 */

import { HomeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <HomeIcon className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
