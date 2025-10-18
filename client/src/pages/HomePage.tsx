/**
 * Page d'accueil
 * Conforme référentiel DWWM 2023
 */

import React from "react";
import CTASection from "../components/Home/CTASection";
import FeaturesSection from "../components/Home/FeaturesSection";
import HeroSection from "../components/Home/HeroSection";
import StatsSection from "../components/Home/StatsSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Section Hero */}
      <HeroSection isAuthenticated={isAuthenticated} />

      {/* Section Statistiques */}
      <StatsSection />

      {/* Section Fonctionnalités */}
      <FeaturesSection />

      {/* Section Témoignages */}
      <TestimonialsSection />

      {/* Section CTA */}
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default HomePage;



