
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
  root.style.setProperty('--primary-hsl', `${primaryHSL.h}, ${primaryHSL.s}%, ${primaryHSL.l}%`);
  root.style.setProperty('--primary-foreground', darkMode ? '210 40% 98%' : '0 0% 98%');
  
  root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--accent-hsl', `${accentHSL.h}, ${accentHSL.s}%, ${accentHSL.l}%`);
  root.style.setProperty('--accent-foreground', darkMode ? '210 40% 98%' : '0 0% 9%');
  
  root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
  root.style.setProperty('--secondary-hsl', `${secondaryHSL.h}, ${secondaryHSL.s}%, ${secondaryHSL.l}%`);
  root.style.setProperty('--secondary-foreground', darkMode ? '210 40% 98%' : '0 0% 9%');
  
  // Appliquer les variables pour les boutons et éléments interactifs
  root.style.setProperty('--muted', darkMode ? '217.2 32.6% 17.5%' : '210 40% 96%');
  root.style.setProperty('--muted-foreground', darkMode ? '215 20.2% 65.1%' : '215.4 16.3% 46.9%');
  
  root.style.setProperty('--border', darkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%');
  root.style.setProperty('--ring', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  
  // Variables pour les couleurs de fond et de texte
  root.style.setProperty('--background', darkMode ? '222.2 84% 4.9%' : '0 0% 100%');
  root.style.setProperty('--foreground', darkMode ? '210 40% 98%' : '222.2 84% 4.9%');
  
  // Appliquer les styles directs pour la barre latérale avec la couleur principale
  const sidebarElements = document.querySelectorAll('.sidebar-custom');
  sidebarElements.forEach(element => {
    (element as HTMLElement).style.backgroundColor = primaryColor;
    const textColor = isLightColor(primaryHSL.l) ? '#1a1a1a' : '#ffffff';
    (element as HTMLElement).style.color = textColor;
  });
  
  // Appliquer les variables pour la barre latérale en utilisant la couleur principale
  root.style.setProperty('--sidebar-background-hex', primaryColor);
  root.style.setProperty('--sidebar-background', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--sidebar-background-hsl', `${primaryHSL.h}, ${primaryHSL.s}%, ${primaryHSL.l}%`);
  
  // Calculer des couleurs dérivées pour la barre latérale avec la couleur principale
  const isLightSidebar = primaryHSL.l > 50;
  root.style.setProperty('--sidebar-foreground', isLightSidebar ? '0 0% 10%' : '210 40% 98%');
  
  // Créer une variante plus claire/foncée pour l'accent de la barre latérale
  if (darkMode || !isLightSidebar) {
    root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${Math.max(0, primaryHSL.s - 10)}% ${Math.min(100, primaryHSL.l + 15)}%`);
  } else {
    root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${Math.min(100, primaryHSL.s + 10)}% ${Math.max(10, primaryHSL.l - 15)}%`);
  }
  
  root.style.setProperty('--sidebar-accent-foreground', isLightSidebar ? '0 0% 10%' : '210 40% 98%');
  root.style.setProperty('--sidebar-primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--sidebar-border', darkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%');
  root.style.setProperty('--sidebar-ring', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  
  // Appliquer le rayon de bordure
  root.style.setProperty('--radius', `${borderRadius}rem`);
  
  // Appliquer la police de caractères
  let fontFamilyValue = "'Inter', sans-serif";
  
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
  
  root.style.fontFamily = fontFamilyValue;

  // Appliquer le mode sombre en ajoutant/supprimant la classe 'dark'
  document.documentElement.classList.toggle("dark", darkMode);
};

// Fonction utilitaire pour déterminer si une couleur est claire ou foncée
const isLightColor = (lightness: number) => lightness > 55;
