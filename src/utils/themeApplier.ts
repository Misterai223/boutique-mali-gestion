
import { hexToHSL } from "./colorUtils";
import type { ThemeSettings } from "../types/theme";

/**
 * Applique les paramètres de thème à l'ensemble du document
 */
export const applyTheme = (settings: Pick<ThemeSettings, 'primaryColor' | 'accentColor' | 'secondaryColor' | 'sidebarColor' | 'borderRadius' | 'fontFamily' | 'darkMode'>) => {
  const { primaryColor, accentColor, secondaryColor, sidebarColor, borderRadius, fontFamily, darkMode } = settings;
  const root = document.documentElement;
  
  // Convertir les couleurs hexadécimales en format HSL pour les variables CSS
  const primaryHSL = hexToHSL(primaryColor);
  const accentHSL = hexToHSL(accentColor);
  const secondaryHSL = hexToHSL(secondaryColor);
  const sidebarHSL = hexToHSL(sidebarColor);
  
  // Appliquer les variables CSS pour les couleurs principales
  root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
  
  // Appliquer les variables pour la barre latérale
  // Utiliser la couleur spécifique pour la barre latérale
  root.style.setProperty('--sidebar-background', `${sidebarHSL.h} ${sidebarHSL.s}% ${sidebarHSL.l}%`);
  
  // Calculer des couleurs dérivées pour la barre latérale
  root.style.setProperty('--sidebar-foreground', '210 40% 98%');
  
  // Créer une variante plus claire/foncée pour l'accent de la barre latérale
  if (darkMode) {
    // En mode sombre, utiliser une variante plus claire
    root.style.setProperty('--sidebar-accent', `${sidebarHSL.h} ${Math.max(0, sidebarHSL.s - 10)}% ${Math.min(100, sidebarHSL.l + 15)}%`);
  } else {
    // En mode clair, utiliser une variante plus foncée
    root.style.setProperty('--sidebar-accent', `${sidebarHSL.h} ${Math.min(100, sidebarHSL.s + 10)}% ${Math.max(0, sidebarHSL.l - 10)}%`);
  }
  
  root.style.setProperty('--sidebar-accent-foreground', '210 40% 98%');
  
  // Mettre à jour les autres variables de la barre latérale
  root.style.setProperty('--sidebar-primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--sidebar-border', darkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%');
  root.style.setProperty('--sidebar-ring', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  
  // Appliquer le rayon de bordure
  root.style.setProperty('--radius', `${borderRadius}rem`);
  
  // Appliquer la police de caractères
  let fontFamilyValue = "'Inter', sans-serif"; // Valeur par défaut
  
  switch(fontFamily) {
    case "Roboto":
      fontFamilyValue = "'Roboto', sans-serif";
      document.body.className = document.body.className.replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');
      document.body.classList.add('font-roboto');
      break;
    case "Poppins":
      fontFamilyValue = "'Poppins', sans-serif";
      document.body.className = document.body.className.replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');
      document.body.classList.add('font-poppins');
      break;
    case "Open Sans":
      fontFamilyValue = "'Open Sans', sans-serif";
      document.body.className = document.body.className.replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');
      document.body.classList.add('font-open-sans');
      break;
    case "Montserrat":
      fontFamilyValue = "'Montserrat', sans-serif";
      document.body.className = document.body.className.replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');
      document.body.classList.add('font-montserrat');
      break;
    case "Nunito":
      fontFamilyValue = "'Nunito', sans-serif";
      document.body.className = document.body.className.replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');
      document.body.classList.add('font-nunito');
      break;
    default:
      fontFamilyValue = "'Inter', sans-serif";
      document.body.className = document.body.className.replace(/font-(sans|roboto|poppins|montserrat|nunito|open-sans)/g, '');
      document.body.classList.add('font-sans');
  }
  
  // Appliquer directement la police aux éléments globaux
  root.style.fontFamily = fontFamilyValue;

  // Appliquer le mode sombre en ajoutant/supprimant la classe 'dark'
  document.documentElement.classList.toggle("dark", darkMode);
};
