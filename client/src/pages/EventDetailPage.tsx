/**
 * Page de détail d'un événement
 * Conforme référentiel DWWM 2023
 */

import React from "react";
import { useParams } from "react-router-dom";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Détail de l'événement
          </h1>
          <p className="text-gray-600">ID de l'événement : {id}</p>
          <p className="text-gray-500 mt-4">Page en cours de développement</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
