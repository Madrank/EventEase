/**
 * Section des statistiques
 * Conforme référentiel DWWM 2023
 */

import React from "react";

const stats = [
  { name: "Événements créés", value: "10,000+" },
  { name: "Utilisateurs actifs", value: "5,000+" },
  { name: "Prestataires partenaires", value: "500+" },
  { name: "Lieux référencés", value: "1,200+" },
];

const StatsSection: React.FC = () => {
  return (
    <section className="bg-primary-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Des chiffres qui parlent</span>
              <span className="block text-primary-200">
                Rejoignez notre communauté grandissante
              </span>
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-primary-200">
              EventEase accompagne déjà des milliers d'organisateurs dans la
              création d'événements mémorables.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-5 sm:p-6"
                >
                  <dt className="text-sm font-medium text-primary-200 truncate">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
