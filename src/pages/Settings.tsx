
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaletteIcon, ShieldCheck, Store, User } from "lucide-react";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

const Settings = () => {
  const { 
    settings, 
    setters, 
    hasChanges, 
    handleSaveSettings, 
    handleResetSettings 
  } = useThemeSettings();
  
  const onSaveSettings = () => {
    const success = handleSaveSettings();
    if (success) {
      toast.success("Paramètres sauvegardés avec succès");
    }
  };

  const onResetSettings = () => {
    handleResetSettings();
    toast.info("Paramètres réinitialisés");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onResetSettings}>
              Annuler
            </Button>
            <Button 
              onClick={onSaveSettings} 
              className="animate-pulse hover:animate-none transition-all"
            >
              Sauvegarder
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Boutique</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaletteIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Compte</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
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
            darkMode={settings.darkMode}
          />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
