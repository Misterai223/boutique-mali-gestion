
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, PaletteIcon, ShieldCheck, Store, User } from "lucide-react";

const Settings = () => {
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
    toast.success("Paramètres sauvegardés avec succès");
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
    
    toast.info("Paramètres réinitialisés");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveSettings} 
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
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence et thème</CardTitle>
              <CardDescription>
                Personnalisez l'apparence visuelle de votre application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Couleur principale</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Couleur d'accent</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Couleur secondaire</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="border-radius">Arrondi des coins (rem)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="border-radius"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(e.target.value)}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{borderRadius}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Carré</span>
                    <span className="text-xs text-muted-foreground">Arrondi</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Police de caractères</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Sélectionner une police" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <p className="text-sm font-medium mb-2">Aperçu du thème</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-background">
                    <h4 className="font-bold">Mode {darkMode ? "sombre" : "clair"}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="h-8 w-16 rounded" style={{ backgroundColor: primaryColor }}></div>
                      <div className="h-8 w-16 rounded" style={{ backgroundColor: accentColor }}></div>
                      <div className="h-8 w-16 rounded" style={{ backgroundColor: secondaryColor }}></div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <Button size="sm" className="mr-2">Bouton</Button>
                      <Button size="sm" variant="outline" className="mr-2">Outline</Button>
                      <Button size="sm" variant="secondary" className="mr-2">Secondary</Button>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                      <div className="h-4 w-4 rounded-full bg-accent"></div>
                      <div className="h-4 w-4 rounded-full bg-secondary"></div>
                      <div className="h-4 w-4 rounded-full bg-muted"></div>
                    </div>
                  </div>
                  <div className="rounded-lg border overflow-hidden" 
                    style={{ 
                      borderRadius: `${borderRadius}rem`,
                      fontFamily: fontFamily === "Inter" ? "'Inter', sans-serif" : 
                                fontFamily === "Roboto" ? "'Roboto', sans-serif" :
                                fontFamily === "Poppins" ? "'Poppins', sans-serif" : 
                                "'Open Sans', sans-serif"
                    }}>
                    <div className="p-4 flex justify-between items-center border-b" style={{ backgroundColor: primaryColor, color: "#fff" }}>
                      <h4 className="font-bold">Exemple d'interface</h4>
                      <Button size="sm" variant="outline" className="bg-white text-black hover:bg-white/90">Action</Button>
                    </div>
                    <div className="p-4 bg-card">
                      <p className="text-sm">Exemple de texte avec la police <strong>{fontFamily}</strong></p>
                      <div className="mt-2 rounded p-2" style={{ backgroundColor: secondaryColor, color: "#fff" }}>
                        Composant secondaire
                      </div>
                      <div className="mt-2 rounded p-2 text-white" style={{ backgroundColor: accentColor }}>
                        Élément d'accent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Compte utilisateur</CardTitle>
              <CardDescription>
                Gérez vos informations de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value="admin@example.com"
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  defaultValue="Admin User"
                  placeholder="Votre nom complet"
                />
              </div>
              <div className="pt-4">
                <Button>Mettre à jour le profil</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Entrez votre mot de passe actuel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Entrez un nouveau mot de passe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                />
              </div>
              <div className="pt-4">
                <Button>Changer le mot de passe</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
