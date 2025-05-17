
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Appliquer le thème sauvegardé au chargement initial
const applyInitialTheme = () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  const savedFont = localStorage.getItem("fontFamily") || "Inter";
  
  // Appliquer uniquement la classe dark/light pour éviter un flash
  document.documentElement.classList.toggle("dark", savedDarkMode);
  
  // Appliquer la police de caractères
  switch(savedFont) {
    case "Roboto":
      document.body.classList.add('font-roboto');
      break;
    case "Poppins":
      document.body.classList.add('font-poppins');
      break;
    case "Open Sans":
      document.body.classList.add('font-open-sans');
      break;
    case "Montserrat":
      document.body.classList.add('font-montserrat');
      break;
    case "Nunito":
      document.body.classList.add('font-nunito');
      break;
    default:
      document.body.classList.add('font-sans');
  }
};

// Appliquer le thème avant le rendu initial
applyInitialTheme();

// Rendre l'application
createRoot(document.getElementById("root")!).render(<App />);
