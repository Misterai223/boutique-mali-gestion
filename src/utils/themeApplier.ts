
import { hexToHSL } from "./colorUtils";
import type { ThemeSettings } from "../types/theme";

/**
 * Applies theme settings to the document in a controlled way
 * to avoid unwanted side effects during navigation
 */
export const applyTheme = (settings: Pick<ThemeSettings, 'primaryColor' | 'accentColor' | 'secondaryColor' | 'borderRadius' | 'fontFamily' | 'darkMode'>) => {
  const { primaryColor, accentColor, secondaryColor, borderRadius, fontFamily, darkMode } = settings;
  const root = document.documentElement;
  
  // Apply CSS variables for colors
  const primaryHSL = hexToHSL(primaryColor);
  const accentHSL = hexToHSL(accentColor);
  const secondaryHSL = hexToHSL(secondaryColor);
  
  // Set CSS variables globally for all contexts
  root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
  
  // Update variables for the sidebar (éviter de changer le background automatiquement)
  if (darkMode) {
    root.style.setProperty('--sidebar-background', '222.2 47.4% 11.2%');
    root.style.setProperty('--sidebar-foreground', '210 40% 98%');
    root.style.setProperty('--sidebar-accent', '217.2 32.6% 17.5%');
    root.style.setProperty('--sidebar-accent-foreground', '210 40% 98%');
  } else {
    // Light mode - use the primary color for sidebar but only through CSS variables
    root.style.setProperty('--sidebar-background', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    root.style.setProperty('--sidebar-foreground', '210 40% 98%');
    root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${Math.max(0, primaryHSL.s - 15)}% ${Math.min(100, primaryHSL.l + 10)}%`);
    root.style.setProperty('--sidebar-accent-foreground', '210 40% 98%');
  }
  
  // Update primary and accent for sidebar
  root.style.setProperty('--sidebar-primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--sidebar-border', darkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%');
  root.style.setProperty('--sidebar-ring', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  
  // Apply border radius
  root.style.setProperty('--radius', `${borderRadius}rem`);
  
  // Apply font family
  if (fontFamily === "Inter") {
    root.style.fontFamily = "'Inter', sans-serif";
  } else if (fontFamily === "Roboto") {
    root.style.fontFamily = "'Roboto', sans-serif";
  } else if (fontFamily === "Poppins") {
    root.style.fontFamily = "'Poppins', sans-serif";
  } else if (fontFamily === "Open Sans") {
    root.style.fontFamily = "'Open Sans', sans-serif";
  }

  // Apply dark mode mais sans forcer le rechargement du style
  document.documentElement.classList.toggle("dark", darkMode);
};
