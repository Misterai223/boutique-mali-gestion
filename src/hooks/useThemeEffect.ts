
import { useEffect } from "react";
import { applyTheme } from "@/utils/themeApplier";
import { loadThemeSettings } from "@/utils/themeStorage";

/**
 * Hook to handle theme application effects across the application
 * Improved to avoid unwanted side effects when navigating
 */
export const useThemeEffect = () => {
  useEffect(() => {
    // Charge les paramètres de thème une seule fois au montage du composant
    const settings = loadThemeSettings();
    
    // Applique le thème avec des paramètres chargés
    applyTheme({
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
    
    // Observer pour les changements de thème via localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && ['primaryColor', 'accentColor', 'secondaryColor', 'darkMode', 'borderRadius', 'fontFamily'].includes(event.key)) {
        // Recharger uniquement si les clés liées au thème changent
        const updatedSettings = loadThemeSettings();
        applyTheme({
          primaryColor: updatedSettings.primaryColor,
          accentColor: updatedSettings.accentColor,
          secondaryColor: updatedSettings.secondaryColor,
          borderRadius: updatedSettings.borderRadius,
          fontFamily: updatedSettings.fontFamily,
          darkMode: updatedSettings.darkMode
        });
      }
    };
    
    // Écouter les événements personnalisés pour la mise à jour du thème
    const handleCustomEvent = () => {
      const updatedSettings = loadThemeSettings();
      applyTheme({
        primaryColor: updatedSettings.primaryColor,
        accentColor: updatedSettings.accentColor,
        secondaryColor: updatedSettings.secondaryColor,
        borderRadius: updatedSettings.borderRadius,
        fontFamily: updatedSettings.fontFamily,
        darkMode: updatedSettings.darkMode
      });
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('localStorage.updated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('localStorage.updated', handleCustomEvent);
    };
  }, []);
};
