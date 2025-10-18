/**
 * Page des prestataires
 * Conforme référentiel DWWM 2023
 */

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

interface Provider {
  id: string;
  name: string;
  description: string;
  category: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  logo?: string;
  priceRange?: string;
}

const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { value: "all", label: "Tous" },
    { value: "CATERING", label: "Traiteur" },
    { value: "PHOTOGRAPHY", label: "Photographie" },
    { value: "MUSIC", label: "Musique" },
    { value: "DECORATION", label: "Décoration" },
    { value: "VENUE", label: "Lieu" },
    { value: "TRANSPORT", label: "Transport" },
    { value: "OTHER", label: "Autre" },
  ];

  // Données de démonstration
  const mockProviders: Provider[] = [
    {
      id: "1",
      name: "Traiteur Deluxe",
      description: "Service de traiteur haut de gamme pour tous vos événements",
      category: "CATERING",
      email: "contact@traiteur-deluxe.com",
      phone: "01 23 45 67 89",
      address: "123 Rue de la Gastronomie",
      city: "Paris",
      rating: 4.8,
      reviewCount: 127,
      isVerified: true,
      priceRange: "€€€",
    },
    {
      id: "2",
      name: "Studio Photo Pro",
      description: "Photographe professionnel spécialisé dans les événements",
      category: "PHOTOGRAPHY",
      email: "info@studiophotopro.com",
      phone: "01 98 76 54 32",
      address: "456 Avenue des Arts",
      city: "Lyon",
      rating: 4.9,
      reviewCount: 89,
      isVerified: true,
      priceRange: "€€",
    },
    {
      id: "3",
      name: "DJ Music Events",
      description:
        "Animation musicale et sonorisation pour tous types d'événements",
      category: "MUSIC",
      email: "booking@djmusicevents.com",
      phone: "06 12 34 56 78",
      city: "Marseille",
      rating: 4.7,
      reviewCount: 156,
      isVerified: true,
      priceRange: "€€",
    },
    {
      id: "4",
      name: "Déco & Design",
      description: "Décoration florale et design d'événements sur mesure",
      category: "DECORATION",
      email: "contact@deco-design.fr",
      phone: "01 55 44 33 22",
      address: "789 Boulevard de la Créativité",
      city: "Toulouse",
      rating: 4.6,
      reviewCount: 73,
      isVerified: false,
      priceRange: "€€€",
    },
  ];

  useEffect(() => {
    // Simulation du chargement des données
    const loadProviders = async () => {
      setIsLoading(true);
      // Simuler un délai de chargement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProviders(mockProviders);
      setIsLoading(false);
    };

    loadProviders();
  }, []);

  const filteredProviders = providers.filter((provider) => {
    const matchesCategory =
      selectedCategory === "all" || provider.category === selectedCategory;
    const matchesSearch = provider.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prestataires
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez nos prestataires partenaires pour votre événement
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rechercher un prestataire
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom du prestataire..."
              />
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Catégorie
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des prestataires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {
                        categories.find(
                          (cat) => cat.value === provider.category,
                        )?.label
                      }
                    </p>
                    {provider.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  {provider.logo && (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {provider.description}
                </p>

                {/* Note et avis */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {renderStars(provider.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {provider.rating} ({provider.reviewCount} avis)
                  </span>
                </div>

                {/* Informations de contact */}
                <div className="space-y-2 mb-4">
                  {provider.phone && (
                    <p className="text-sm text-gray-600">📞 {provider.phone}</p>
                  )}
                  {provider.address && provider.city && (
                    <p className="text-sm text-gray-600">
                      📍 {provider.address}, {provider.city}
                    </p>
                  )}
                  {provider.priceRange && (
                    <p className="text-sm text-gray-600">
                      💰 {provider.priceRange}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium">
                    Contacter
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucun prestataire trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous êtes prestataire ?
            </h3>
            <p className="text-gray-600 mb-6">
              Rejoignez notre réseau de prestataires partenaires et développez
              votre activité
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium">
              Devenir partenaire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
