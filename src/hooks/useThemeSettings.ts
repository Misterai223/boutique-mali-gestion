
import { useState, useEffect } from 'react';

export interface ThemeSettings {
  shopName: string;
  currency: string;
  darkMode: boolean;
  notifications: boolean;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  borderRadius: string;
  fontFamily: string;
}

export const useThemeSettings = () => {
  // General settings
  const [shopName, setShopName] = useState("My Shop");
  const [currency, setCurrency] = useState("XOF");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [notifications, setNotifications] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  
  // Theme settings
  const [primaryColor, setPrimaryColor] = useState("#1E3A8A");
  const [accentColor, setAccentColor] = useState("#F59E0B");
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6");
  const [borderRadius, setBorderRadius] = useState("0.5");
  const [fontFamily, setFontFamily] = useState("Inter");
  
  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);
  
  // Track initial values to detect changes
  const [initialValues, setInitialValues] = useState({
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
  });

  // Apply color theme changes immediately when values change
  useEffect(() => {
    const root = document.documentElement;
    
    // Convert hex to hsl for Tailwind CSS variables
    const hexToHSL = (hex: string) => {
      // Remove the # if present
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      let r = parseInt(hex.substr(0, 2), 16) / 255;
      let g = parseInt(hex.substr(2, 2), 16) / 255;
      let b = parseInt(hex.substr(4, 2), 16) / 255;
      
      // Find greatest and smallest channel values
      let cmin = Math.min(r, g, b);
      let cmax = Math.max(r, g, b);
      let delta = cmax - cmin;
      let h = 0;
      let s = 0;
      let l = 0;
      
      // Calculate hue
      if (delta === 0) {
        h = 0;
      } else if (cmax === r) {
        h = ((g - b) / delta) % 6;
      } else if (cmax === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
      
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      
      // Calculate lightness
      l = (cmax + cmin) / 2;
      
      // Calculate saturation
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
      // Convert to percentages
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);
      
      return { h, s, l };
    };
    
    // Apply CSS variables for colors
    const primaryHSL = hexToHSL(primaryColor);
    const accentHSL = hexToHSL(accentColor);
    const secondaryHSL = hexToHSL(secondaryColor);
    
    // Set CSS variables for light mode
    root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
    root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
    
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
  }, [primaryColor, accentColor, secondaryColor, borderRadius, fontFamily]);

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
    // Apply dark mode immediately
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    
    // Update initial values to match current values
    setInitialValues({
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
    });
    
    setHasChanges(false);
    return true; // Return true to indicate successful save
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
