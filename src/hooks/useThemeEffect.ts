
import { useEffect } from "react";

/**
 * Hook to handle theme application effects across the application
 */
export const useThemeEffect = () => {
  useEffect(() => {
    const applyThemeToBackground = () => {
      const savedPrimaryColor = localStorage.getItem("primaryColor");
      const savedAccentColor = localStorage.getItem("accentColor");
      const savedSecondaryColor = localStorage.getItem("secondaryColor");
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      
      if (savedPrimaryColor || savedAccentColor || savedSecondaryColor) {
        // Déclencher un reflow pour forcer une mise à jour visuelle
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.style.transition = "background-color 0.3s ease";
        }
        
        const sidebarElement = document.querySelector('aside');
        if (sidebarElement) {
          sidebarElement.style.transition = "background-color 0.3s ease";
        }
        
        // Appliquer la classe dark au documentElement si nécessaire
        document.documentElement.classList.toggle("dark", savedDarkMode);
      }
    };
    
    applyThemeToBackground();
    
    // Observer les changements dans le DOM pour reappliquer le thème si nécessaire
    const observer = new MutationObserver(() => {
      applyThemeToBackground();
    });
    
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => observer.disconnect();
  }, []);
};
