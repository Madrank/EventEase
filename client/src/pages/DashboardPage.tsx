/**
 * Page du tableau de bord
 * Conforme référentiel DWWM 2023
 */

import {
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyEuroIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Données mockées - à remplacer par des vraies données
  const stats = [
    {
      name: "Événements actifs",
      value: "3",
      icon: CalendarIcon,
      color: "text-blue-600",
    },
    {
      name: "Invités total",
      value: "127",
      icon: UserGroupIcon,
      color: "text-green-600",
    },
    {
      name: "Cagnottes collectées",
      value: "2,450€",
      icon: CurrencyEuroIcon,
      color: "text-yellow-600",
    },
    {
      name: "Taux de participation",
      value: "85%",
      icon: ChartBarIcon,
      color: "text-purple-600",
    },
  ];

  const recentEvents = [
    {
      id: "1",
      title: "Mariage Sophie & Pierre",
      date: "2024-06-15",
      guests: 127,
      status: "En cours",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "2",
      title: "Anniversaire Marie",
      date: "2024-05-20",
      guests: 25,
      status: "Terminé",
      color: "bg-gray-100 text-gray-800",
    },
    {
      id: "3",
      title: "Événement d'entreprise",
      date: "2024-07-10",
      guests: 50,
      status: "Planifié",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const upcomingTasks = [
    {
      id: "1",
      title: "Confirmer le traiteur",
      dueDate: "2024-05-15",
      priority: "high",
    },
    {
      id: "2",
      title: "Envoyer les invitations",
      dueDate: "2024-05-20",
      priority: "medium",
    },
    {
      id: "3",
      title: "Réserver la salle",
      dueDate: "2024-05-25",
      priority: "high",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.firstName} ! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Voici un aperçu de vos événements et activités récentes.
          </p>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/events/create"
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Créer un événement
            </Link>
            <Link to="/events" className="btn btn-outline flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Voir tous les événements
            </Link>
            <Link to="/providers" className="btn btn-outline flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Trouver des prestataires
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Événements récents */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Événements récents
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                        <span className="mx-2">•</span>
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {event.guests} invités
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${event.color}`}
                      >
                        {event.status}
                      </span>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  to="/events"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Voir tous les événements →
                </Link>
              </div>
            </div>
          </div>

          {/* Tâches à venir */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Tâches à venir
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.priority === "high" ? "Urgent" : "Normal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir toutes les tâches →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques et analyses */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Analyses et tendances
              </h2>
            </div>
            <div className="card-body">
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Graphiques en cours de développement
                </h3>
                <p className="text-gray-500">
                  Les analyses détaillées de vos événements seront bientôt
                  disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;



