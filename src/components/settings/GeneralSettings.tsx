
import { useState, useEffect } from "react";
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
  CardFooter,
} from "@/components/ui/card";
import { Store, Edit, Image } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

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
  const [localShopName, setLocalShopName] = useState(shopName);
  const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalShopName(shopName);
    setLocalLogoUrl(logoUrl);
  }, [shopName, logoUrl]);

  useEffect(() => {
    const hasNameChanged = localShopName !== shopName;
    const hasLogoChanged = localLogoUrl !== logoUrl;
    setHasChanges(hasNameChanged || hasLogoChanged);
  }, [localShopName, localLogoUrl, shopName, logoUrl]);

  const handleSaveChanges = () => {
    setShopName(localShopName);
    setLogoUrl(localLogoUrl);
    
    // Synchroniser avec localStorage pour une mise à jour instantanée dans toute l'application
    localStorage.setItem("shopName", localShopName);
    
    // Important: Use shopLogo key instead of logoUrl for consistency across the application
    localStorage.setItem("shopLogo", localLogoUrl);
    
    // Dispatch a custom event to notify other components of the changes
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
    toast({
      title: "Paramètres sauvegardés",
      description: "Les informations de l'entreprise ont été mises à jour",
    });
    
    setHasChanges(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Informations de l'entreprise
        </CardTitle>
        <CardDescription>
          Configurez les informations de base de votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 rounded-xl border shadow-sm">
              <AvatarImage 
                src={localLogoUrl || undefined} 
                alt="Logo de l'entreprise" 
                className="object-contain"
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                <Store className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full">
              <Label htmlFor="logo-url">URL du logo</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="logo-url"
                  value={localLogoUrl}
                  onChange={(e) => setLocalLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setLocalLogoUrl("")}
                  disabled={!localLogoUrl}
                  title="Effacer l'URL"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Entrez l'URL d'une image pour votre logo d'entreprise
              </p>
            </div>
          </div>
          
          <div className="space-y-4 w-full md:w-2/3">
            <div className="space-y-2">
              <Label htmlFor="shop-name">Nom de l'entreprise</Label>
              <Input
                id="shop-name"
                value={localShopName}
                onChange={(e) => setLocalShopName(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ce nom apparaîtra dans la barre de navigation et sur tous les documents
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">F CFA (Franc CFA)</SelectItem>
                  <SelectItem value="USD">USD (Dollar américain)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Devise utilisée pour tous les montants dans l'application
              </p>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Mode sombre</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changer l'apparence de l'interface
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Activer ou désactiver les notifications
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {hasChanges && (
        <CardFooter className="flex justify-end space-x-2 border-t bg-muted/50 p-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setLocalShopName(shopName);
              setLocalLogoUrl(logoUrl);
              setHasChanges(false);
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleSaveChanges} className="animate-pulse-subtle">
            Enregistrer les modifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GeneralSettings;
