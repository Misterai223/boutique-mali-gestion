
import { hexToHSL } from "./colorUtils";
import type { ThemeSettings } from "../types/theme";

/**
 * Applique les paramètres de thème à l'ensemble du document
 */
export const applyTheme = (settings: Pick<ThemeSettings, 'primaryColor' | 'accentColor' | 'secondaryColor' | 'borderRadius' | 'fontFamily' | 'darkMode'>) => {
  const { primaryColor, accentColor, secondaryColor, borderRadius, fontFamily, darkMode } = settings;
  const root = document.documentElement;
  
  // Convertir les couleurs hexadécimales en format HSL pour les variables CSS
  const primaryHSL = hexToHSL(primaryColor);
  const accentHSL = hexToHSL(accentColor);
  const secondaryHSL = hexToHSL(secondaryColor);
  
  // Appliquer les variables CSS pour les couleurs principales
  root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
  
  // Appliquer les variables pour la barre latérale
  if (darkMode) {
    // Mode sombre - style de barre latérale spécifique au mode sombre
    root.style.setProperty('--sidebar-background', '222.2 47.4% 11.2%');
    root.style.setProperty('--sidebar-foreground', '210 40% 98%');
    root.style.setProperty('--sidebar-accent', '217.2 32.6% 17.5%');
    root.style.setProperty('--sidebar-accent-foreground', '210 40% 98%');
  } else {
    // Mode clair - utiliser la couleur principale pour la barre latérale
    root.style.setProperty('--sidebar-background', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    root.style.setProperty('--sidebar-foreground', '210 40% 98%');
    root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${Math.max(0, primaryHSL.s - 15)}% ${Math.min(100, primaryHSL.l + 10)}%`);
    root.style.setProperty('--sidebar-accent-foreground', '210 40% 98%');
  }
  
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
      break;
    case "Poppins":
      fontFamilyValue = "'Poppins', sans-serif";
      break;
    case "Open Sans":
      fontFamilyValue = "'Open Sans', sans-serif";
      break;
    case "Montserrat":
      fontFamilyValue = "'Montserrat', sans-serif";
      break;
    case "Nunito":
      fontFamilyValue = "'Nunito', sans-serif";
      break;
    default:
      fontFamilyValue = "'Inter', sans-serif";
  }
  
  root.style.fontFamily = fontFamilyValue;

  // Appliquer le mode sombre en ajoutant/supprimant la classe 'dark'
  document.documentElement.classList.toggle("dark", darkMode);
};
