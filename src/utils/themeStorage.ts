
import type { ThemeSettings } from "../types/theme";

/**
 * Loads theme settings from localStorage
 */
export const loadThemeSettings = (): ThemeSettings => {
  const savedShopName = localStorage.getItem("shopName");
  const savedCurrency = localStorage.getItem("currency");
  const savedDarkMode = localStorage.getItem("darkMode");
  const savedNotifications = localStorage.getItem("notifications");
  const savedLogoUrl = localStorage.getItem("logoUrl");
  const savedPrimaryColor = localStorage.getItem("primaryColor");
  const savedAccentColor = localStorage.getItem("accentColor");
  const savedSecondaryColor = localStorage.getItem("secondaryColor");
  const savedSidebarColor = localStorage.getItem("sidebarColor");
  const savedBorderRadius = localStorage.getItem("borderRadius");
  const savedFontFamily = localStorage.getItem("fontFamily");
  
  return {
    shopName: savedShopName || "My Shop",
    currency: savedCurrency || "XOF",
    darkMode: savedDarkMode === "true",
    notifications: savedNotifications === "true" || true,
    logoUrl: savedLogoUrl || "",
    primaryColor: savedPrimaryColor || "#1E3A8A",
    accentColor: savedAccentColor || "#F59E0B",
    secondaryColor: savedSecondaryColor || "#3B82F6",
    sidebarColor: savedSidebarColor || "#1E293B",
    borderRadius: savedBorderRadius || "0.5",
    fontFamily: savedFontFamily || "Inter",
  };
};

/**
 * Saves theme settings to localStorage
 */
export const saveThemeSettings = (settings: ThemeSettings): void => {
  localStorage.setItem("shopName", settings.shopName);
  localStorage.setItem("currency", settings.currency);
  localStorage.setItem("darkMode", settings.darkMode.toString());
  localStorage.setItem("notifications", settings.notifications.toString());
  localStorage.setItem("logoUrl", settings.logoUrl);
  localStorage.setItem("primaryColor", settings.primaryColor);
  localStorage.setItem("accentColor", settings.accentColor);
  localStorage.setItem("secondaryColor", settings.secondaryColor);
  localStorage.setItem("sidebarColor", settings.sidebarColor);
  localStorage.setItem("borderRadius", settings.borderRadius);
  localStorage.setItem("fontFamily", settings.fontFamily);
};
