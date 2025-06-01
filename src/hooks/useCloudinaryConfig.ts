
import { useState, useEffect } from "react";
import { cloudinaryService } from "@/services/cloudinaryService";
import { getCloudName, getApiKey, getApiSecret, getUploadPreset } from "@/integrations/cloudinary/client";
import { toast } from "sonner";

export const useCloudinaryConfig = () => {
  const [cloudName, setCloudName] = useState<string>(getCloudName());
  const [apiKey, setApiKey] = useState<string>(getApiKey());
  const [apiSecret, setApiSecret] = useState<string>(getApiSecret());
  const [uploadPreset, setUploadPreset] = useState<string>(getUploadPreset());
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const configured = cloudinaryService.isConfigured();
    setIsConfigured(configured);
    
    if (configured) {
      console.log('✅ Cloudinary est correctement configuré');
      toast.success("Cloudinary configuré avec succès");
    } else {
      console.warn('⚠️ Cloudinary n\'est pas configuré');
    }
    
    return configured;
  };

  const saveConfiguration = () => {
    if (!cloudName || !apiKey || !apiSecret) {
      toast.error("Veuillez remplir tous les champs");
      return false;
    }
    
    try {
      cloudinaryService.configureCredentials(cloudName, apiKey, apiSecret, uploadPreset);
      checkConfiguration();
      toast.success("Configuration Cloudinary enregistrée avec succès");
      return true;
    } catch (error: any) {
      toast.error(`Erreur lors de l'enregistrement de la configuration: ${error.message}`);
      return false;
    }
  };

  return {
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
  };
};
