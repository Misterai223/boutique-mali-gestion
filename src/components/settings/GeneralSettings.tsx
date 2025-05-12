
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store } from "lucide-react";

interface GeneralSettingsProps {
  shopName: string;
  setShopName: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  logoUrl: string;
  setLogoUrl: (value: string) => void;
}

const GeneralSettings = ({
  shopName,
  setShopName,
  currency,
  setCurrency,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  logoUrl,
  setLogoUrl,
}: GeneralSettingsProps) => {
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de la boutique</CardTitle>
        <CardDescription>
          Configurez les informations de base de votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shop-name">Nom de la boutique</Label>
          <Input
            id="shop-name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
              <SelectItem value="USD">USD (Dollar américain)</SelectItem>
              <SelectItem value="EUR">EUR (Euro)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo-url">URL du logo</Label>
          <Input
            id="logo-url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
          {logoUrl && (
            <div className="mt-2 p-2 border rounded">
              <p className="text-sm mb-1">Aperçu:</p>
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+URL";
                }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Mode sombre</Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Notifications</Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
