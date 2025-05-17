
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
  const applyFont = (fontName: string) => {
    // Supprimer toutes les classes de police existantes
    document.body.className = document.body.className
      .replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');

    // Ajouter la nouvelle classe de police
    switch(fontName) {
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

  applyFont(savedFont);
  
  // Appliquer les couleurs de base pour éviter le flash
  const savedPrimaryColor = localStorage.getItem("primaryColor") || "#1E3A8A";
  const savedAccentColor = localStorage.getItem("accentColor") || "#F59E0B";
  const savedSecondaryColor = localStorage.getItem("secondaryColor") || "#3B82F6";
  const savedSidebarColor = localStorage.getItem("sidebarColor") || "#1E293B";
  
  // Appliquer les variables CSS pour les couleurs
  const root = document.documentElement;
  root.style.setProperty('--primary-color', savedPrimaryColor);
  root.style.setProperty('--accent-color', savedAccentColor);
  root.style.setProperty('--secondary-color', savedSecondaryColor);
  root.style.setProperty('--sidebar-background-hex', savedSidebarColor);
};

// Appliquer le thème avant le rendu initial
applyInitialTheme();

// Rendre l'application
createRoot(document.getElementById("root")!).render(<App />);
