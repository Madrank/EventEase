/**
 * En-tête de l'application
 * Conforme référentiel DWWM 2023
 */

import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CalendarIcon,
  Cog6ToothIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../store/hooks";
import { logoutUser } from "../../store/slices/authSlice";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
    setIsProfileOpen(false);
  };

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Fonctionnalités", href: "#features" },
    { name: "Prestataires", href: "/providers" },
    { name: "Lieux", href: "/venues" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const userNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: UserIcon },
    { name: "Mes événements", href: "/events", icon: CalendarIcon },
    { name: "Profil", href: "/profile", icon: Cog6ToothIcon },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CalendarIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                EventEase
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${
                  location.pathname === item.href ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                {/* Menu profil */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="hidden md:block text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>

                {/* Dropdown profil */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-primary-600 p-2"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
