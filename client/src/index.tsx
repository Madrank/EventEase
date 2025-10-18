/**
 * Point d'entrée de l'application EventEase
 * Conforme référentiel DWWM 2023
 */
// Importation des dépendances
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Styles globaux
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// Rendu de l'application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
