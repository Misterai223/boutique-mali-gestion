
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudFog } from "lucide-react";
import CloudinaryConfigForm from "@/components/settings/cloudinary/CloudinaryConfigForm";
import { useCloudinaryConfig } from "@/hooks/useCloudinaryConfig";

const CloudinarySettings = () => {
  const {
    cloudName,
    setCloudName,
    apiKey,
    setApiKey,
    apiSecret,
    setApiSecret,
    uploadPreset,
    setUploadPreset,
    isConfigured,
    saveConfiguration
  } = useCloudinaryConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfiguration();
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
        <CloudinaryConfigForm 
          cloudName={cloudName}
          apiKey={apiKey}
          apiSecret={apiSecret}
          uploadPreset={uploadPreset}
          isConfigured={isConfigured}
          onCloudNameChange={setCloudName}
          onApiKeyChange={setApiKey}
          onApiSecretChange={setApiSecret}
          onUploadPresetChange={setUploadPreset}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default CloudinarySettings;
