/*
 Page des lieux
 */

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  capacity: number;
  pricePerDay?: number;
  amenities: string;
  images: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

const VenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");

  const cities = [
    { value: "all", label: "Toutes les villes" },
    { value: "Paris", label: "Paris" },
    { value: "Lyon", label: "Lyon" },
    { value: "Marseille", label: "Marseille" },
    { value: "Toulouse", label: "Toulouse" },
    { value: "Nice", label: "Nice" },
    { value: "Nantes", label: "Nantes" },
    { value: "Strasbourg", label: "Strasbourg" },
  ];

  const capacityRanges = [
    { value: "all", label: "Toutes capacités" },
    { value: "1-50", label: "1 - 50 personnes" },
    { value: "51-100", label: "51 - 100 personnes" },
    { value: "101-200", label: "101 - 200 personnes" },
    { value: "201-500", label: "201 - 500 personnes" },
    { value: "500+", label: "500+ personnes" },
  ];

  const priceRanges = [
    { value: "all", label: "Tous les prix" },
    { value: "0-500", label: "Moins de 500€/jour" },
    { value: "500-1000", label: "500€ - 1000€/jour" },
    { value: "1000-2000", label: "1000€ - 2000€/jour" },
    { value: "2000+", label: "Plus de 2000€/jour" },
  ];

  // Données de démonstration
  const mockVenues: Venue[] = [
    {
      id: "1",
      name: "Château de Versailles - Salle des Fêtes",
      description:
        "Prestigieux château historique avec une salle des fêtes de 300m² pour vos événements d'exception",
      address: "Place d'Armes",
      city: "Versailles",
      postalCode: "78000",
      country: "France",
      capacity: 200,
      pricePerDay: 2500,
      amenities: "Parking, Climatisation, Cuisine équipée, Terrasse, Jardin",
      images: "chateau-versailles.jpg",
      rating: 4.9,
      reviewCount: 45,
      isActive: true,
      latitude: 48.8049,
      longitude: 2.1204,
    },
    {
      id: "2",
      name: "Espace Montmartre",
      description:
        "Salle moderne et polyvalente au cœur de Montmartre, idéale pour séminaires et événements privés",
      address: "15 Rue des Abbesses",
      city: "Paris",
      postalCode: "75018",
      country: "France",
      capacity: 80,
      pricePerDay: 800,
      amenities:
        "WiFi, Climatisation, Équipement audiovisuel, Cuisine, Parking",
      images: "espace-montmartre.jpg",
      rating: 4.6,
      reviewCount: 127,
      isActive: true,
      latitude: 48.8846,
      longitude: 2.3392,
    },
    {
      id: "3",
      name: "Villa Méditerranée",
      description:
        "Villa de luxe avec vue sur mer, piscine et jardin paysager pour vos réceptions privées",
      address: "45 Promenade des Anglais",
      city: "Nice",
      postalCode: "06000",
      country: "France",
      capacity: 150,
      pricePerDay: 1800,
      amenities:
        "Piscine, Jardin, Terrasse, Cuisine professionnelle, Parking privé",
      images: "villa-mediterranee.jpg",
      rating: 4.8,
      reviewCount: 89,
      isActive: true,
      latitude: 43.7102,
      longitude: 7.262,
    },
    {
      id: "4",
      name: "Centre de Congrès Lyon",
      description:
        "Centre moderne et spacieux avec 5 salles modulables, parfait pour conférences et événements d'entreprise",
      address: "50 Quai Charles de Gaulle",
      city: "Lyon",
      postalCode: "69006",
      country: "France",
      capacity: 500,
      pricePerDay: 1200,
      amenities:
        "Salles modulables, Équipement audiovisuel, Restauration, Parking, WiFi",
      images: "centre-congres-lyon.jpg",
      rating: 4.5,
      reviewCount: 203,
      isActive: true,
      latitude: 45.764,
      longitude: 4.8357,
    },
    {
      id: "5",
      name: "Ferme de la Renaissance",
      description:
        "Ferme rénovée avec charme d'antan, idéale pour mariages et événements champêtres",
      address: "Route de la Ferme",
      city: "Toulouse",
      postalCode: "31000",
      country: "France",
      capacity: 120,
      pricePerDay: 600,
      amenities:
        "Jardin, Terrasse, Cuisine rustique, Parking, Animaux de ferme",
      images: "ferme-renaissance.jpg",
      rating: 4.7,
      reviewCount: 156,
      isActive: true,
      latitude: 43.6047,
      longitude: 1.4442,
    },
  ];

  useEffect(() => {
    // Simulation du chargement des données
    const loadVenues = async () => {
      setIsLoading(true);
      // Simuler un délai de chargement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVenues(mockVenues);
      setIsLoading(false);
    };

    loadVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const matchesCity = selectedCity === "all" || venue.city === selectedCity;
    const matchesSearch = venue.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesCapacity = true;
    if (capacityFilter !== "all") {
      const [min, max] = capacityFilter.split("-").map(Number);
      if (capacityFilter === "500+") {
        matchesCapacity = venue.capacity >= 500;
      } else {
        matchesCapacity = venue.capacity >= min && venue.capacity <= max;
      }
    }

    let matchesPrice = true;
    if (priceRange !== "all" && venue.pricePerDay) {
      const [min, max] = priceRange.split("-").map(Number);
      if (priceRange === "2000+") {
        matchesPrice = venue.pricePerDay >= 2000;
      } else {
        matchesPrice = venue.pricePerDay >= min && venue.pricePerDay <= max;
      }
    }

    return matchesCity && matchesSearch && matchesCapacity && matchesPrice;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
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
            Lieux d'événements
          </h1>
          <p className="text-xl text-gray-600">
            Trouvez le lieu parfait pour votre événement
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rechercher un lieu
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nom du lieu..."
              />
            </div>

            {/* Ville */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ville
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacité */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Capacité
              </label>
              <select
                id="capacity"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {capacityRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prix par jour
              </label>
              <select
                id="price"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des lieux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image du lieu */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-4xl">🏛️</div>
              </div>

              <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {venue.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {venue.address}, {venue.city} {venue.postalCode}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        👥 {venue.capacity} personnes
                      </span>
                      {venue.pricePerDay && (
                        <span className="ml-4 text-sm font-medium text-primary-600">
                          💰 {formatPrice(venue.pricePerDay)}/jour
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {venue.description}
                </p>

                {/* Note et avis */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {renderStars(venue.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {venue.rating} ({venue.reviewCount} avis)
                  </span>
                </div>

                {/* Équipements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Équipements :
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {venue.amenities
                      .split(", ")
                      .slice(0, 3)
                      .map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    {venue.amenities.split(", ").length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{venue.amenities.split(", ").length - 3} autres
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium">
                    Réserver
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
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucun lieu trouvé
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
              Vous avez un lieu à louer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Mettez votre lieu en location et générez des revenus
              supplémentaires
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium">
              Proposer mon lieu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;
