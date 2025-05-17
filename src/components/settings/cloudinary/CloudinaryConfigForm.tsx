
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Cloud } from "lucide-react";
import { motion } from "framer-motion";

interface CloudinaryConfigFormProps {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
  isConfigured: boolean;
  onCloudNameChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onApiSecretChange: (value: string) => void;
  onUploadPresetChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CloudinaryConfigForm = ({
  cloudName,
  apiKey,
  apiSecret,
  uploadPreset,
  isConfigured,
  onCloudNameChange,
  onApiKeyChange,
  onApiSecretChange,
  onUploadPresetChange,
  onSubmit
}: CloudinaryConfigFormProps) => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.form 
      onSubmit={onSubmit} 
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="space-y-2"
        variants={itemVariants}
      >
        <Label htmlFor="cloudName" className="flex items-center gap-1.5">
          <Cloud className="h-4 w-4 text-primary" />
          Cloud Name
        </Label>
        <Input
          id="cloudName"
          value={cloudName}
          onChange={(e) => onCloudNameChange(e.target.value)}
          placeholder="Votre cloud name"
          required
          className="input-enhanced focus:border-primary"
        />
      </motion.div>
      
      <motion.div 
        className="space-y-2"
        variants={itemVariants}
      >
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Votre API key"
          required
          className="input-enhanced focus:border-primary"
        />
      </motion.div>
      
      <motion.div 
        className="space-y-2"
        variants={itemVariants}
      >
        <Label htmlFor="apiSecret">API Secret</Label>
        <Input
          id="apiSecret"
          type="password"
          value={apiSecret}
          onChange={(e) => onApiSecretChange(e.target.value)}
          placeholder="Votre API secret"
          required
          className="input-enhanced focus:border-primary"
        />
        <p className="text-xs text-muted-foreground italic">
          Note: Cette clé est stockée localement et n'est pas partagée.
        </p>
      </motion.div>
      
      <motion.div 
        className="space-y-2"
        variants={itemVariants}
      >
        <Label htmlFor="uploadPreset">Upload Preset (non signé)</Label>
        <Input
          id="uploadPreset"
          value={uploadPreset}
          onChange={(e) => onUploadPresetChange(e.target.value)}
          placeholder="Preset d'upload non signé"
          required
          className="input-enhanced focus:border-primary"
        />
        <p className="text-xs text-muted-foreground italic">
          Note: Assurez-vous que ce preset est configuré comme "non signé" dans votre compte Cloudinary.
        </p>
      </motion.div>
      
      <motion.div 
        className="flex justify-between items-center pt-2"
        variants={itemVariants}
      >
        <div>
          {isConfigured && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center text-sm text-green-600 dark:text-green-400"
            >
              <Check className="h-4 w-4 mr-1" />
              Configuration active
            </motion.div>
          )}
        </div>
        <Button 
          type="submit" 
          variant="default"
          className="relative overflow-hidden group btn-animated"
        >
          <span className="relative z-10">Enregistrer</span>
          <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default CloudinaryConfigForm;
