
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "@/components/settings/GeneralSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import LogoSettings from "@/components/settings/LogoSettings";
import CloudinarySettings from "@/components/settings/CloudinarySettings";
import { useThemeSettings } from "@/hooks/useThemeSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, setters } = useThemeSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience et configurez les paramètres de votre compte
        </p>
      </div>

      <Card className="overflow-hidden">
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b">
            <div className="px-4 md:px-6">
              <TabsList className="flex overflow-x-auto py-2 bg-transparent space-x-4">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="appearance">Apparence</TabsTrigger>
                <TabsTrigger value="account">Compte</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="logo">Logo</TabsTrigger>
                <TabsTrigger value="cloudinary">Cloudinary</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="general" className="p-4 md:p-6">
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
          
          <TabsContent value="appearance" className="p-4 md:p-6">
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
              toggleDarkMode={setters.setDarkMode}
            />
          </TabsContent>
          
          <TabsContent value="account" className="p-4 md:p-6">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="security" className="p-4 md:p-6">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="logo" className="p-4 md:p-6">
            <LogoSettings />
          </TabsContent>
          
          <TabsContent value="cloudinary" className="p-4 md:p-6">
            <CloudinarySettings />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
