/**
 * Layout principal de l'application
 * Conforme référentiel DWWM 2023
 */

import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default Layout;



