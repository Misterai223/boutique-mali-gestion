
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Appliquer le thème sauvegardé au chargement initial de manière contrôlée
const applyInitialTheme = () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  // Appliquer uniquement le mode sombre/clair sans autre effet secondaire
  document.documentElement.classList.toggle("dark", savedDarkMode);
  
  // Ne pas appliquer d'autres changements de style ici pour éviter les effets secondaires
  // Le hook useThemeEffect s'en chargera une fois l'application montée
};

// Appliquer uniquement la classe dark/light avant le rendu initial pour éviter le flash
applyInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
