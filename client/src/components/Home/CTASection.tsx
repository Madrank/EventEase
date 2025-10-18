/**
 * Section Call-to-Action
 * Conforme référentiel DWWM 2023
 */

import React from "react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  isAuthenticated: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isAuthenticated }) => {
  return (
    <section className="bg-primary-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Prêt à organiser votre événement ?</span>
          <span className="block text-primary-200">
            Commencez dès maintenant avec EventEase.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Aller au tableau de bord
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Créer un compte
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
