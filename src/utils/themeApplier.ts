
import { hexToHSL } from "./colorUtils";
import type { ThemeSettings } from "../types/theme";

/**
 * Applies theme settings to the document
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
  
  // Update variables for the sidebar and background
  root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  root.style.setProperty('--sidebar-background', darkMode ? '222.2 47.4% 11.2%' : `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
  
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

  // Apply dark mode immediately
  document.documentElement.classList.toggle("dark", darkMode);
  
  // Force re-application of theme on main background
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.classList.remove('bg-background/50');
    void mainElement.offsetWidth; // Trigger reflow
    mainElement.classList.add('bg-background/50');
  }
};
