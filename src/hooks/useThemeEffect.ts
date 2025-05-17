
import { useEffect } from "react";
import { applyTheme } from "@/utils/themeApplier";
import { loadThemeSettings } from "@/utils/themeStorage";

/**
 * Hook pour gérer l'application du thème dans toute l'application
 */
export const useThemeEffect = () => {
  useEffect(() => {
    // Charger les paramètres de thème une seule fois au montage du composant
    const settings = loadThemeSettings();
    
    // Appliquer le thème avec les paramètres chargés
    applyTheme({
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      sidebarColor: settings.sidebarColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
    
    // Écouter les changements de thème via localStorage
    const handleThemeChange = () => {
      const updatedSettings = loadThemeSettings();
      applyTheme({
        primaryColor: updatedSettings.primaryColor,
        accentColor: updatedSettings.accentColor,
        secondaryColor: updatedSettings.secondaryColor,
        sidebarColor: updatedSettings.sidebarColor,
        borderRadius: updatedSettings.borderRadius,
        fontFamily: updatedSettings.fontFamily,
        darkMode: updatedSettings.darkMode
      });
    };
    
    // Configurer les écouteurs d'événements pour les changements de thème
    document.addEventListener('localStorage.updated', handleThemeChange);
    window.addEventListener('storage', (event) => {
      if (event.key && ['primaryColor', 'accentColor', 'secondaryColor', 'sidebarColor', 'darkMode', 'borderRadius', 'fontFamily'].includes(event.key)) {
        handleThemeChange();
      }
    });
    
    // Nettoyer les écouteurs d'événements
    return () => {
      document.removeEventListener('localStorage.updated', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange as any);
    };
  }, []);
};
