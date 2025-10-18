/**
 * Section des témoignages
 * Conforme référentiel DWWM 2023
 */

import React from "react";

const testimonials = [
  {
    body: "EventEase a révolutionné la façon dont j'organise mes événements. L'interface est intuitive et les fonctionnalités sont parfaites.",
    author: {
      name: "Marie Dubois",
      handle: "Organisatrice d'événements",
    },
  },
  {
    body: "La fonctionnalité de cagnotte collaborative est géniale ! Mes invités peuvent contribuer facilement au financement de l'événement.",
    author: {
      name: "Pierre Martin",
      handle: "Organisateur de mariage",
    },
  },
  {
    body: "Je recommande EventEase à tous mes amis. C'est simple, efficace et sécurisé. Parfait pour organiser des fêtes entre amis.",
    author: {
      name: "Sophie Leroy",
      handle: "Organisatrice de soirées",
    },
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Témoignages
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Ce que disent nos utilisateurs
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <blockquote className="text-gray-900">
                  <p className="text-lg">"{testimonial.body}"</p>
                </blockquote>
                <footer className="mt-4">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-900">
                        {testimonial.author.name}
                      </div>
                      <div className="text-base text-gray-500">
                        {testimonial.author.handle}
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
