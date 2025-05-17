
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudFog } from "lucide-react";
import CloudinaryConfigForm from "@/components/settings/cloudinary/CloudinaryConfigForm";
import { useCloudinaryConfig } from "@/hooks/useCloudinaryConfig";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <CloudFog className="h-5 w-5 text-primary" />
            <CardTitle>Configuration Cloudinary</CardTitle>
          </motion.div>
          <CardDescription>
            Configurez vos identifiants Cloudinary pour la gestion des fichiers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
    </motion.div>
  );
};

export default CloudinarySettings;
