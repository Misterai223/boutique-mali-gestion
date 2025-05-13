
import { useState, useEffect } from "react";
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
  
  // Force refresh of the main layout when theme changes
  const [forceRefresh, setForceRefresh] = useState(0);
  
  useEffect(() => {
    // Trigger a reflow to ensure CSS variables are applied
    if (forceRefresh > 0) {
      const main = document.querySelector('main');
      if (main) {
        main.style.transition = "background-color 0.3s ease";
        setTimeout(() => {
          main.style.transition = "";
        }, 300);
      }
    }
  }, [forceRefresh]);
  
  const onSaveSettings = () => {
    const success = handleSaveSettings();
    if (success) {
      toast.success("Paramètres sauvegardés avec succès");
      // Force reflow to apply theme changes
      setForceRefresh(prev => prev + 1);
      
      // Add a small delay then refresh the document to ensure theme is fully applied
      setTimeout(() => {
        const savedPrimaryColor = localStorage.getItem("primaryColor");
        const savedAccentColor = localStorage.getItem("accentColor");
        const savedSecondaryColor = localStorage.getItem("secondaryColor");
        
        const root = document.documentElement;
        
        // Convert hex to hsl and apply again to ensure the theme is properly applied
        const hexToHSL = (hex: string) => {
          hex = hex.replace(/^#/, '');
          let r = parseInt(hex.substr(0, 2), 16) / 255;
          let g = parseInt(hex.substr(2, 2), 16) / 255;
          let b = parseInt(hex.substr(4, 2), 16) / 255;
          let cmin = Math.min(r, g, b);
          let cmax = Math.max(r, g, b);
          let delta = cmax - cmin;
          let h = 0, s = 0, l = 0;
          
          if (delta === 0) h = 0;
          else if (cmax === r) h = ((g - b) / delta) % 6;
          else if (cmax === g) h = (b - r) / delta + 2;
          else h = (r - g) / delta + 4;
          
          h = Math.round(h * 60);
          if (h < 0) h += 360;
          
          l = (cmax + cmin) / 2;
          s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
          
          s = +(s * 100).toFixed(1);
          l = +(l * 100).toFixed(1);
          
          return { h, s, l };
        };
        
        if (savedPrimaryColor) {
          const primaryHSL = hexToHSL(savedPrimaryColor);
          root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
          root.style.setProperty('--sidebar-accent', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
        }
        
        if (savedAccentColor) {
          const accentHSL = hexToHSL(savedAccentColor);
          root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
        }
        
        if (savedSecondaryColor) {
          const secondaryHSL = hexToHSL(savedSecondaryColor);
          root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
        }
      }, 100);
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
