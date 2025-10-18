/**
 * Section Hero de la page d'accueil
 * Conforme référentiel DWWM 2023
 */

import {
  CalendarIcon,
  CheckIcon,
  CurrencyEuroIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
  return (
    <section className="hero-gradient text-white min-h-screen flex items-center relative overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      <div className="container-responsive relative z-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Organisez l'événement parfait{" "}
              <span className="text-yellow-300">sans stress</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              La solution tout-en-un pour créer, gérer et partager vos
              événements professionnels ou privés en quelques clics.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Tableau de bord
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Commencer maintenant
                </Link>
              )}

              <button className="btn btn-lg bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center">
                <PlayIcon className="h-5 w-5 mr-2" />
                Voir la démo
              </button>
            </div>

            {/* Badges de confiance */}
            <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2 text-green-300" />
                <span>Gratuit 14 jours</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2 text-green-300" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2 text-green-300" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative animate-float">
            <div className="relative">
              {/* Image principale */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3">
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl p-6">
                  <CalendarIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Mariage Sophie & Pierre
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    15 Juin 2024 • Château de Versailles
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        127
                      </div>
                      <div className="text-sm text-gray-500">Invités</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-600">
                        85%
                      </div>
                      <div className="text-sm text-gray-500">RSVP</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges flottants */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-fade-in-delay-1">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Événement créé</p>
                    <p className="font-bold text-gray-800">
                      Mariage Sophie & Pierre
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-fade-in-delay-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CurrencyEuroIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Cagnotte</p>
                    <p className="font-bold text-gray-800">1,250€ collectés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse delay-500"></div>
    </section>
  );
};

export default HeroSection;
