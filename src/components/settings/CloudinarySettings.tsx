
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloudinaryService } from "@/services/cloudinaryService";
import { toast } from "sonner";
import { CloudFog, Check } from "lucide-react";

const CloudinarySettings = () => {
  const [cloudName, setCloudName] = useState<string>(localStorage.getItem('CLOUDINARY_CLOUD_NAME') || '');
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('CLOUDINARY_API_KEY') || '');
  const [apiSecret, setApiSecret] = useState<string>(localStorage.getItem('CLOUDINARY_API_SECRET') || '');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const configured = cloudinaryService.isConfigured();
    setIsConfigured(configured);
    return configured;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cloudName || !apiKey || !apiSecret) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      cloudinaryService.configureCredentials(cloudName, apiKey, apiSecret);
      checkConfiguration();
      toast.success("Configuration Cloudinary enregistrée avec succès");
    } catch (error: any) {
      toast.error(`Erreur lors de l'enregistrement de la configuration: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudFog className="h-5 w-5" />
          Configuration Cloudinary
        </CardTitle>
        <CardDescription>
          Configurez vos identifiants Cloudinary pour la gestion des fichiers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cloudName">Cloud Name</Label>
            <Input
              id="cloudName"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              placeholder="Votre cloud name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Votre API key"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Votre API secret"
              required
            />
            <p className="text-xs text-muted-foreground">
              Note: Cette clé est stockée localement et n'est pas partagée.
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div>
              {isConfigured && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <Check className="h-4 w-4 mr-1" />
                  Configuration active
                </div>
              )}
            </div>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CloudinarySettings;
