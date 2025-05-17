
import { useState, useEffect } from "react";
import { loadThemeSettings, saveThemeSettings } from "@/utils/themeStorage";
import { applyTheme } from "@/utils/themeApplier";
import type { ThemeSettings } from "../types/theme";
import { toast } from "sonner";

/**
 * Hook pour gérer les paramètres de thème de l'application
 */
export const useThemeSettings = () => {
  // Charger les paramètres initiaux depuis le stockage local
  const [settings, setSettings] = useState<ThemeSettings>(() => loadThemeSettings());
  const [initialSettings, setInitialSettings] = useState<ThemeSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Appliquer les paramètres de thème lorsqu'ils changent
  useEffect(() => {
    // Appliquer le thème actuel
    applyTheme({
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
    
    // Vérifier s'il y a des changements non sauvegardés
    const hasChanged = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setHasChanges(hasChanged);
  }, [settings, initialSettings]);

  // Fonctions pour mettre à jour chaque paramètre
  const setShopName = (shopName: string) => {
    setSettings(prev => ({ ...prev, shopName }));
  };

  const setCurrency = (currency: string) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const setDarkMode = (darkMode: boolean) => {
    setSettings(prev => ({ ...prev, darkMode }));
    
    // Mettre à jour le mode sombre/clair immédiatement pour une meilleure expérience
    document.documentElement.classList.toggle("dark", darkMode);
    
    // Stocker dans localStorage pour être cohérent avec le ThemeToggle
    localStorage.setItem("darkMode", darkMode.toString());
    
    // Notifier les autres composants du changement
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
  };

  const setNotifications = (notifications: boolean) => {
    setSettings(prev => ({ ...prev, notifications }));
  };

  const setLogoUrl = (logoUrl: string) => {
    setSettings(prev => ({ ...prev, logoUrl }));
  };

  const setPrimaryColor = (primaryColor: string) => {
    setSettings(prev => ({ ...prev, primaryColor }));
  };

  const setAccentColor = (accentColor: string) => {
    setSettings(prev => ({ ...prev, accentColor }));
  };

  const setSecondaryColor = (secondaryColor: string) => {
    setSettings(prev => ({ ...prev, secondaryColor }));
  };

  const setBorderRadius = (borderRadius: string) => {
    setSettings(prev => ({ ...prev, borderRadius }));
  };

  const setFontFamily = (fontFamily: string) => {
    setSettings(prev => ({ ...prev, fontFamily }));
  };

  // Sauvegarder tous les paramètres dans le stockage local
  const handleSaveSettings = () => {
    // Sauvegarder dans localStorage
    saveThemeSettings(settings);
    
    // Mettre à jour les paramètres initiaux
    setInitialSettings(settings);
    setHasChanges(false);
    
    // Notifier les autres composants des changements
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
    // Afficher une notification de succès
    toast.success("Paramètres de thème sauvegardés avec succès");
    
    // Appliquer le thème immédiatement
    applyTheme({
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
  };

  // Réinitialiser les modifications non sauvegardées
  const handleResetSettings = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    
    // Appliquer les paramètres initiaux
    applyTheme({
      primaryColor: initialSettings.primaryColor,
      accentColor: initialSettings.accentColor,
      secondaryColor: initialSettings.secondaryColor,
      borderRadius: initialSettings.borderRadius,
      fontFamily: initialSettings.fontFamily,
      darkMode: initialSettings.darkMode
    });
    
    toast.info("Modifications annulées");
  };

  return {
    settings,
    setters: {
      setShopName,
      setCurrency,
      setDarkMode,
      setNotifications,
      setLogoUrl,
      setPrimaryColor,
      setAccentColor,
      setSecondaryColor,
      setBorderRadius,
      setFontFamily
    },
    hasChanges,
    handleSaveSettings,
    handleResetSettings
  };
};
