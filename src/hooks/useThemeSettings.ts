
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
      sidebarColor: settings.sidebarColor,
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
    // Mettre à jour immédiatement dans localStorage pour la prévisualisation
    localStorage.setItem("primaryColor", primaryColor);
  };

  const setAccentColor = (accentColor: string) => {
    setSettings(prev => ({ ...prev, accentColor }));
    // Mettre à jour immédiatement dans localStorage pour la prévisualisation
    localStorage.setItem("accentColor", accentColor);
  };

  const setSecondaryColor = (secondaryColor: string) => {
    setSettings(prev => ({ ...prev, secondaryColor }));
    // Mettre à jour immédiatement dans localStorage pour la prévisualisation
    localStorage.setItem("secondaryColor", secondaryColor);
  };

  const setSidebarColor = (sidebarColor: string) => {
    setSettings(prev => ({ ...prev, sidebarColor }));
    // Mettre à jour immédiatement dans localStorage pour la prévisualisation
    localStorage.setItem("sidebarColor", sidebarColor);
    
    // Notifier les autres composants pour une mise à jour instantanée
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
  };

  const setBorderRadius = (borderRadius: string) => {
    setSettings(prev => ({ ...prev, borderRadius }));
    // Mettre à jour immédiatement dans localStorage pour la prévisualisation
    localStorage.setItem("borderRadius", borderRadius);
  };

  const setFontFamily = (fontFamily: string) => {
    setSettings(prev => ({ ...prev, fontFamily }));
    // Mettre à jour immédiatement dans localStorage pour la prévisualisation
    localStorage.setItem("fontFamily", fontFamily);
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
      sidebarColor: settings.sidebarColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
  };

  // Réinitialiser les modifications non sauvegardées
  const handleResetSettings = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    
    // Mise à jour immédiate du localStorage pour la prévisualisation
    localStorage.setItem("primaryColor", initialSettings.primaryColor);
    localStorage.setItem("accentColor", initialSettings.accentColor);
    localStorage.setItem("secondaryColor", initialSettings.secondaryColor);
    localStorage.setItem("sidebarColor", initialSettings.sidebarColor);
    localStorage.setItem("borderRadius", initialSettings.borderRadius);
    localStorage.setItem("fontFamily", initialSettings.fontFamily);
    localStorage.setItem("darkMode", initialSettings.darkMode.toString());
    
    // Appliquer les paramètres initiaux
    applyTheme({
      primaryColor: initialSettings.primaryColor,
      accentColor: initialSettings.accentColor,
      secondaryColor: initialSettings.secondaryColor,
      sidebarColor: initialSettings.sidebarColor,
      borderRadius: initialSettings.borderRadius,
      fontFamily: initialSettings.fontFamily,
      darkMode: initialSettings.darkMode
    });
    
    // Notifier les autres composants
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
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
      setSidebarColor,
      setBorderRadius,
      setFontFamily
    },
    hasChanges,
    handleSaveSettings,
    handleResetSettings
  };
};
