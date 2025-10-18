/**
 * Page de gestion des événements
 * Conforme référentiel DWWM 2023
 */

import {
  CalendarIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Données mockées - à remplacer par des vraies données
  const events = [
    {
      id: "1",
      title: "Mariage Sophie & Pierre",
      description: "Mariage romantique au Château de Versailles",
      date: "2024-06-15",
      time: "14:00",
      location: "Château de Versailles, Versailles",
      guests: 127,
      status: "En cours",
      color: "bg-green-100 text-green-800",
      coverImage:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    },
    {
      id: "2",
      title: "Anniversaire Marie",
      description: "Fête d'anniversaire surprise",
      date: "2024-05-20",
      time: "19:00",
      location: "Restaurant Le Bistrot, Paris",
      guests: 25,
      status: "Terminé",
      color: "bg-gray-100 text-gray-800",
      coverImage:
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400",
    },
    {
      id: "3",
      title: "Événement d'entreprise",
      description: "Lancement de produit",
      date: "2024-07-10",
      time: "09:00",
      location: "Centre de conférences, Paris",
      guests: 50,
      status: "Planifié",
      color: "bg-blue-100 text-blue-800",
      coverImage:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400",
    },
    {
      id: "4",
      title: "Soirée networking",
      description: "Rencontre professionnelle",
      date: "2024-08-15",
      time: "18:30",
      location: "Hôtel Plaza Athénée, Paris",
      guests: 80,
      status: "Planifié",
      color: "bg-blue-100 text-blue-800",
      coverImage:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && event.status === "En cours") ||
      (statusFilter === "planned" && event.status === "Planifié") ||
      (statusFilter === "completed" && event.status === "Terminé");
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "Tous les événements" },
    { value: "active", label: "En cours" },
    { value: "planned", label: "Planifiés" },
    { value: "completed", label: "Terminés" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mes événements
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez tous vos événements en un seul endroit
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/events/create"
                className="btn btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Créer un événement
              </Link>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-64">
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "Aucun événement trouvé"
                : "Aucun événement créé"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par créer votre premier événement."}
            </p>
            <Link to="/events/create" className="btn btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Créer un événement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                {/* Image de couverture */}
                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${event.color}`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString("fr-FR")} à{" "}
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      {event.guests} invités
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/events/${event.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Voir les détails
                    </Link>
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Précédent
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Suivant
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;



