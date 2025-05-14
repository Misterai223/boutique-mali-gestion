
// Import des composants existants
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "@/components/settings/GeneralSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import LogoSettings from "@/components/settings/LogoSettings";
import { useThemeSettings } from "@/hooks/useThemeSettings";

const Settings = () => {
  const {
    settings,
    setters,
    hasChanges,
    handleSaveSettings,
    handleResetSettings
  } = useThemeSettings();
  
  return (
    <div className="container py-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings 
            shopName={settings.shopName}
            setShopName={setters.setShopName}
            currency={settings.currency}
            setCurrency={setters.setCurrency}
            darkMode={settings.darkMode}
            setDarkMode={setters.setDarkMode}
            notifications={settings.notifications}
            setNotifications={setters.setNotifications}
            logoUrl={settings.logoUrl}
            setLogoUrl={setters.setLogoUrl}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings 
            primaryColor={settings.primaryColor}
            setPrimaryColor={setters.setPrimaryColor}
            accentColor={settings.accentColor}
            setAccentColor={setters.setAccentColor}
            secondaryColor={settings.secondaryColor}
            setSecondaryColor={setters.setSecondaryColor}
            borderRadius={settings.borderRadius}
            setBorderRadius={setters.setBorderRadius}
            fontFamily={settings.fontFamily}
            setFontFamily={setters.setFontFamily}
          />
        </TabsContent>
        
        <TabsContent value="logo">
          <LogoSettings 
            logoUrl={settings.logoUrl}
            setLogoUrl={setters.setLogoUrl}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
