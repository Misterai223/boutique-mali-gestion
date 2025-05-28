
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import LogoSettings from "@/components/settings/LogoSettings";
import InvoiceSettings from "@/components/settings/InvoiceSettings";
import { useThemeSettings } from "@/hooks/useThemeSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { theme, setTheme } = useTheme();
  const { settings, setters, hasChanges, handleSaveSettings, handleResetSettings } = useThemeSettings();

  const [shopName, setShopName] = useState(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("shopName") || "Mon Commerce"
      : "Mon Commerce"
  );
  const [currency, setCurrency] = useState("XOF");
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [logoUrl, setLogoUrl] = useState(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("shopLogo") || ""
      : ""
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="invoice">Factures</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            shopName={shopName}
            setShopName={setShopName}
            currency={currency}
            setCurrency={setCurrency}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            notifications={notifications}
            setNotifications={setNotifications}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
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
            sidebarColor={settings.sidebarColor}
            setSidebarColor={setters.setSidebarColor}
            borderRadius={settings.borderRadius}
            setBorderRadius={setters.setBorderRadius}
            fontFamily={settings.fontFamily}
            setFontFamily={setters.setFontFamily}
            darkMode={settings.darkMode}
            setDarkMode={setters.setDarkMode}
            hasChanges={hasChanges}
            onSave={handleSaveSettings}
            onReset={handleResetSettings}
          />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="logos">
          <LogoSettings />
        </TabsContent>

        <TabsContent value="invoice">
          <InvoiceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
