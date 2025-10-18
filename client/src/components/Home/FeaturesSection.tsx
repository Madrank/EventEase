/**
 * Section des fonctionnalités
 * Conforme référentiel DWWM 2023
 */

import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyEuroIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const features = [
  {
    name: "Gestion d'événements",
    description:
      "Créez et gérez vos événements facilement avec notre interface intuitive.",
    icon: CalendarIcon,
  },
  {
    name: "Invitations",
    description:
      "Invitez vos proches par email ou SMS et suivez leurs réponses.",
    icon: UserGroupIcon,
  },
  {
    name: "Cagnotte collaborative",
    description: "Collectez des contributions pour financer votre événement.",
    icon: CurrencyEuroIcon,
  },
  {
    name: "Recherche de lieux",
    description: "Trouvez le lieu parfait selon votre budget et vos besoins.",
    icon: MapPinIcon,
  },
  {
    name: "Messagerie",
    description: "Communiquez avec vos invités directement sur la plateforme.",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Sécurité RGPD",
    description: "Vos données sont protégées selon les standards européens.",
    icon: ShieldCheckIcon,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Fonctionnalités
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tout ce dont vous avez besoin pour organiser
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            EventEase vous accompagne dans l'organisation de vos événements avec
            des outils modernes et sécurisés.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
