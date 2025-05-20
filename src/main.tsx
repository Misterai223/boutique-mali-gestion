
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Appliquer le thème sauvegardé au chargement initial
const applyInitialTheme = () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  // Appliquer uniquement la classe dark/light pour éviter un flash
  document.documentElement.classList.toggle("dark", savedDarkMode);
};

// Appliquer le thème avant le rendu initial
applyInitialTheme();

// Rendre l'application
createRoot(document.getElementById("root")!).render(<App />);
