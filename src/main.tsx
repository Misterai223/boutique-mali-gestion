
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Appliquer le thème sauvegardé au chargement initial
const applyInitialTheme = () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  document.documentElement.classList.toggle("dark", savedDarkMode);
  
  const savedPrimaryColor = localStorage.getItem("primaryColor");
  const savedAccentColor = localStorage.getItem("accentColor");
  const savedSecondaryColor = localStorage.getItem("secondaryColor");
  const savedBorderRadius = localStorage.getItem("borderRadius");
  const savedFontFamily = localStorage.getItem("fontFamily");
  
  const hexToHSL = (hex: string) => {
    hex = hex?.replace(/^#/, '') || '';
    if (!hex) return { h: 0, s: 0, l: 0 };
    
    let r = parseInt(hex.substr(0, 2), 16) / 255;
    let g = parseInt(hex.substr(2, 2), 16) / 255;
    let b = parseInt(hex.substr(4, 2), 16) / 255;
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    return { h, s, l };
  };

  const root = document.documentElement;
  
  if (savedPrimaryColor) {
    const primaryHSL = hexToHSL(savedPrimaryColor);
    root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    if (!savedDarkMode) {
      root.style.setProperty('--sidebar-background', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    }
  }
  
  if (savedAccentColor) {
    const accentHSL = hexToHSL(savedAccentColor);
    root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  }
  
  if (savedSecondaryColor) {
    const secondaryHSL = hexToHSL(savedSecondaryColor);
    root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
  }
  
  if (savedBorderRadius) {
    root.style.setProperty('--radius', `${savedBorderRadius}rem`);
  }
  
  if (savedFontFamily) {
    switch(savedFontFamily) {
      case "Inter": 
        root.style.fontFamily = "'Inter', sans-serif";
        break;
      case "Roboto": 
        root.style.fontFamily = "'Roboto', sans-serif";
        break;
      case "Poppins": 
        root.style.fontFamily = "'Poppins', sans-serif";
        break;
      case "Open Sans": 
        root.style.fontFamily = "'Open Sans', sans-serif";
        break;
    }
  }
};

// Appliquer le thème avant le rendu initial
applyInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
