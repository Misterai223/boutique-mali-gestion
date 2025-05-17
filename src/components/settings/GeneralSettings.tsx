
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
import { Separator } from "@/components/ui/separator";
import { Store, Building, Bell, Globe } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import LogoUploader from "@/components/settings/logos/LogoUploader";
import { settingsService } from "@/services/settingsService";
import CurrentLogo from "@/components/settings/logos/CurrentLogo";

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
  const [isUploading, setIsUploading] = useState(false);
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
    
    // Synchronize with localStorage for immediate updates across the application
    localStorage.setItem("shopName", localShopName);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez utiliser JPG, PNG, GIF ou SVG.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const url = await settingsService.uploadLogo(file);
      
      if (url) {
        setLocalLogoUrl(url);
        setHasChanges(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloudinaryUploadComplete = (url: string) => {
    setLocalLogoUrl(url);
    setHasChanges(true);
  };

  const handleMediaLibrarySelect = (url: string) => {
    setLocalLogoUrl(url);
    setHasChanges(true);
  };

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Store className="h-5 w-5 text-primary" />
          Informations de l'entreprise
        </CardTitle>
        <CardDescription>
          Configurez les informations de base de votre entreprise
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo Section */}
          <div className="space-y-6 md:col-span-5">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  Logo de l'entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col items-center space-y-6">
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
                  
                  <div className="w-full space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground text-center">
                        Le logo sera affiché dans la barre latérale et en haut de l'application
                      </p>
                    </div>
                    
                    <LogoUploader
                      isUploading={isUploading}
                      useCloudinary={false}
                      onFileChange={handleFileChange}
                      onCloudinaryUploadComplete={handleCloudinaryUploadComplete}
                      onMediaLibrarySelect={handleMediaLibrarySelect}
                    />
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Formats acceptés: JPG, PNG, GIF, SVG. Taille max: 5MB
                    </p>
                    
                    <CurrentLogo logoUrl={localLogoUrl} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Settings Section */}
          <div className="md:col-span-7 space-y-6">
            {/* Basic Information Section */}
            <Card>
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Information de base
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shop-name" className="text-sm font-medium">Nom de l'entreprise</Label>
                    <Input
                      id="shop-name"
                      value={localShopName}
                      onChange={(e) => setLocalShopName(e.target.value)}
                      className="text-base"
                      placeholder="Nom de votre entreprise"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ce nom apparaîtra dans la barre de navigation et sur tous les documents
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">Devise</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="w-full">
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XOF">F CFA (Franc CFA)</SelectItem>
                        <SelectItem value="USD">USD (Dollar américain)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Devise utilisée pour tous les montants dans l'application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Preferences Section */}
            <Card>
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-background/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode" className="flex items-center gap-2 text-sm font-medium">
                        <span>Mode sombre</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Changer l'apparence de l'interface
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-background/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications" className="flex items-center gap-2 text-sm font-medium">
                        <span>Notifications</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
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
              </CardContent>
            </Card>
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
          <Button 
            onClick={handleSaveChanges} 
            className="shadow-sm hover:shadow-md transition-all"
          >
            Enregistrer les modifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GeneralSettings;
