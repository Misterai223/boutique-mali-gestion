
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GeneralSettings from "@/components/settings/GeneralSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import LogoSettings from "@/components/settings/LogoSettings";
import CloudinarySettings from "@/components/settings/CloudinarySettings";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Palette, Shield, User, Image, Cloud } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, setters, hasChanges, handleSaveSettings, handleResetSettings } = useThemeSettings();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">
          Personnalisez votre expérience et configurez les paramètres de votre compte
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden shadow-md border-primary/10">
          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b bg-muted/30">
              <div className="px-4 md:px-6 overflow-x-auto">
                <TabsList className="flex py-2 bg-transparent space-x-1 h-auto">
                  <TabsTrigger value="general" className="flex gap-1.5 items-center data-[state=active]:bg-background">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Général</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex gap-1.5 items-center data-[state=active]:bg-background">
                    <Palette className="h-4 w-4" />
                    <span>Apparence</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex gap-1.5 items-center data-[state=active]:bg-background">
                    <User className="h-4 w-4" />
                    <span>Compte</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex gap-1.5 items-center data-[state=active]:bg-background">
                    <Shield className="h-4 w-4" />
                    <span>Sécurité</span>
                  </TabsTrigger>
                  <TabsTrigger value="logo" className="flex gap-1.5 items-center data-[state=active]:bg-background">
                    <Image className="h-4 w-4" />
                    <span>Logo</span>
                  </TabsTrigger>
                  <TabsTrigger value="cloudinary" className="flex gap-1.5 items-center data-[state=active]:bg-background">
                    <Cloud className="h-4 w-4" />
                    <span>Cloudinary</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="pt-2 pb-4">
              <TabsContent value="general" className="p-4 md:p-6 mt-0">
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
              
              <TabsContent value="appearance" className="p-4 md:p-6 mt-0">
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
              
              <TabsContent value="account" className="p-4 md:p-6 mt-0">
                <AccountSettings />
              </TabsContent>
              
              <TabsContent value="security" className="p-4 md:p-6 mt-0">
                <SecuritySettings />
              </TabsContent>
              
              <TabsContent value="logo" className="p-4 md:p-6 mt-0">
                <LogoSettings />
              </TabsContent>
              
              <TabsContent value="cloudinary" className="p-4 md:p-6 mt-0">
                <CloudinarySettings />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </motion.div>
      
      {hasChanges && (
        <motion.div 
          className="fixed bottom-4 right-4 flex space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button 
            onClick={handleResetSettings} 
            variant="outline" 
            className="shadow-md"
            size="sm"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            className="shadow-md animate-pulse-subtle"
            size="sm"
          >
            Enregistrer les changements
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Settings;
