
import { useState, useEffect } from "react";
import { cloudinaryService } from "@/services/cloudinaryService";
import { toast } from "sonner";

export const useCloudinaryConfig = () => {
  const [cloudName, setCloudName] = useState<string>(localStorage.getItem('CLOUDINARY_CLOUD_NAME') || 'dqhdjnmrq');
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('CLOUDINARY_API_KEY') || '833693739153773');
  const [apiSecret, setApiSecret] = useState<string>(localStorage.getItem('CLOUDINARY_API_SECRET') || '7spozpGI-CN333Qo8Zp_FMXWzg0');
  const [uploadPreset, setUploadPreset] = useState<string>(localStorage.getItem('CLOUDINARY_UPLOAD_PRESET') || 'testprojet');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const configured = cloudinaryService.isConfigured();
    setIsConfigured(configured);
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
