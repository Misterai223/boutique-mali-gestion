
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import LogoSettings from "@/components/settings/LogoSettings";
import AccountSettings from "@/components/settings/AccountSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre boutique
        </p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="general" className="mt-0">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="appearance" className="mt-0">
            <AppearanceSettings />
          </TabsContent>
          <TabsContent value="account" className="mt-0">
            <AccountSettings />
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="logo" className="mt-0">
            <LogoSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
