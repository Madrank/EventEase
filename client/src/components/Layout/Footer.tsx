/**
 * Pied de page de l'application
 * Conforme référentiel DWWM 2023
 */

import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Fonctionnalités", href: "#features" },
      { name: "Tarifs", href: "#pricing" },
      { name: "Applications", href: "#apps" },
      { name: "Nouveautés", href: "#news" },
    ],
    resources: [
      { name: "Blog", href: "#blog" },
      { name: "Centre d'aide", href: "#help" },
      { name: "Tutoriels", href: "#tutorials" },
      { name: "FAQ", href: "#faq" },
    ],
    company: [
      { name: "À propos", href: "#about" },
      { name: "Carrières", href: "#careers" },
      { name: "Presse", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
    legal: [
      { name: "Confidentialité", href: "#privacy" },
      { name: "Conditions d'utilisation", href: "#terms" },
      { name: "Cookies", href: "#cookies" },
      { name: "RGPD", href: "#gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", href: "#", icon: "facebook" },
    { name: "Twitter", href: "#", icon: "twitter" },
    { name: "Instagram", href: "#", icon: "instagram" },
    { name: "LinkedIn", href: "#", icon: "linkedin" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">EventEase</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              La solution tout-en-un pour organiser vos événements en toute
              simplicité. Créez, gérez et partagez vos événements professionnels
              ou privés.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-primary-400" />
                <span className="text-sm">contact@eventease.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-primary-400" />
                <span className="text-sm">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-primary-400" />
                <span className="text-sm">Paris, France</span>
              </div>
            </div>
          </div>

          {/* Liens Produit */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Ressources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Entreprise */}
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Recevez les dernières actualités et conseils pour organiser vos
              événements.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn btn-primary">S'abonner</button>
            </div>
          </div>
        </div>

        {/* Liens sociaux et copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={link.name}
              >
                <span className="sr-only">{link.name}</span>
                <div className="h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600">
                  {/* Icône sociale - à remplacer par des vraies icônes */}
                  <span className="text-xs font-bold">{link.name[0]}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              © {currentYear} EventEase. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



