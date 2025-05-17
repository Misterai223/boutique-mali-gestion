
import { useState, useEffect } from "react";
import { loadThemeSettings, saveThemeSettings } from "@/utils/themeStorage";
import { applyTheme } from "@/utils/themeApplier";
import type { ThemeSettings } from "../types/theme";
import { toast } from "sonner";

export const useThemeSettings = () => {
  const [settings, setSettings] = useState<ThemeSettings>(() => loadThemeSettings());
  const [initialSettings, setInitialSettings] = useState<ThemeSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Apply theme settings when component mounts or settings change
  useEffect(() => {
    applyTheme({
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
    
    // Check if settings have changed
    const hasChanged = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setHasChanges(hasChanged);
  }, [settings, initialSettings]);

  const setShopName = (shopName: string) => {
    setSettings(prev => ({ ...prev, shopName }));
  };

  const setCurrency = (currency: string) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const setDarkMode = (darkMode: boolean) => {
    setSettings(prev => ({ ...prev, darkMode }));
    // Apply immediately for better UX
    document.documentElement.classList.toggle("dark", darkMode);
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

  const handleSaveSettings = () => {
    saveThemeSettings(settings);
    setInitialSettings(settings);
    setHasChanges(false);
    
    // Dispatch a custom event to notify other components of the changes
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
    toast.success("Paramètres sauvegardés avec succès");
    
    // Apply theme immediately
    applyTheme({
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      borderRadius: settings.borderRadius,
      fontFamily: settings.fontFamily,
      darkMode: settings.darkMode
    });
  };

  const handleResetSettings = () => {
    setSettings(initialSettings);
    setHasChanges(false);
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
