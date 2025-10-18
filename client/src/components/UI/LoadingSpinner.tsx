/**
 * Composant de chargement
 * Conforme référentiel DWWM 2023
 */

import { clsx } from "clsx";
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={clsx("flex flex-col items-center justify-center", className)}
    >
      <div
        className={clsx("loading-spinner", sizeClasses[size])}
        role="status"
        aria-label="Chargement en cours"
      >
        <span className="sr-only">Chargement...</span>
      </div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;



