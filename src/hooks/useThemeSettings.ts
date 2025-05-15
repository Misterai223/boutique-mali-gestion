
import { useState, useEffect } from 'react';
import type { ThemeSettings } from '@/types/theme';
import { applyTheme } from '@/utils/themeApplier';
import { loadThemeSettings, saveThemeSettings } from '@/utils/themeStorage';

export type { ThemeSettings };

export const useThemeSettings = () => {
  // Load initial settings from storage
  const initialSettings = loadThemeSettings();
  
  // General settings
  const [shopName, setShopName] = useState(initialSettings.shopName);
  const [currency, setCurrency] = useState(initialSettings.currency);
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl);
  
  // Theme settings
  const [primaryColor, setPrimaryColor] = useState(initialSettings.primaryColor);
  const [accentColor, setAccentColor] = useState(initialSettings.accentColor);
  const [secondaryColor, setSecondaryColor] = useState(initialSettings.secondaryColor);
  const [borderRadius, setBorderRadius] = useState(initialSettings.borderRadius);
  const [fontFamily, setFontFamily] = useState(initialSettings.fontFamily);
  
  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<ThemeSettings>(initialSettings);

  // Apply theme when settings change
  useEffect(() => {
    applyTheme({
      primaryColor,
      accentColor,
      secondaryColor,
      borderRadius,
      fontFamily,
      darkMode
    });
  }, [primaryColor, accentColor, secondaryColor, borderRadius, fontFamily, darkMode]);

  // Detect changes
  useEffect(() => {
    const currentValues = {
      shopName,
      currency,
      darkMode,
      notifications,
      logoUrl,
      primaryColor,
      accentColor,
      secondaryColor,
      borderRadius,
      fontFamily,
    };
    
    setHasChanges(JSON.stringify(initialValues) !== JSON.stringify(currentValues));
  }, [
    shopName,
    currency,
    darkMode,
    notifications,
    logoUrl,
    primaryColor,
    accentColor,
    secondaryColor,
    borderRadius,
    fontFamily,
    initialValues
  ]);

  const handleSaveSettings = () => {
    // Current settings
    const currentSettings: ThemeSettings = {
      shopName,
      currency,
      darkMode,
      notifications,
      logoUrl,
      primaryColor,
      accentColor,
      secondaryColor,
      borderRadius,
      fontFamily,
    };
    
    // Save settings
    saveThemeSettings(currentSettings);
    
    // Update initial values
    setInitialValues(currentSettings);
    
    // Apply theme
    applyTheme({
      primaryColor,
      accentColor,
      secondaryColor,
      borderRadius,
      fontFamily,
      darkMode
    });
    
    setHasChanges(false);
    return true;
  };

  const handleResetSettings = () => {
    // Reset to initial values
    setShopName(initialValues.shopName);
    setCurrency(initialValues.currency);
    setDarkMode(initialValues.darkMode);
    setNotifications(initialValues.notifications);
    setLogoUrl(initialValues.logoUrl);
    setPrimaryColor(initialValues.primaryColor);
    setAccentColor(initialValues.accentColor);
    setSecondaryColor(initialValues.secondaryColor);
    setBorderRadius(initialValues.borderRadius);
    setFontFamily(initialValues.fontFamily);
  };

  return {
    settings: {
      shopName,
      currency,
      darkMode,
      notifications,
      logoUrl,
      primaryColor,
      accentColor,
      secondaryColor,
      borderRadius,
      fontFamily,
    },
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
      setFontFamily,
    },
    hasChanges,
    handleSaveSettings,
    handleResetSettings,
  };
};
