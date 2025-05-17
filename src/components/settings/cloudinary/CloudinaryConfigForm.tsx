
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cloudName">Cloud Name</Label>
        <Input
          id="cloudName"
          value={cloudName}
          onChange={(e) => onCloudNameChange(e.target.value)}
          placeholder="Votre cloud name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
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
          onChange={(e) => onApiSecretChange(e.target.value)}
          placeholder="Votre API secret"
          required
        />
        <p className="text-xs text-muted-foreground">
          Note: Cette clé est stockée localement et n'est pas partagée.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="uploadPreset">Upload Preset (non signé)</Label>
        <Input
          id="uploadPreset"
          value={uploadPreset}
          onChange={(e) => onUploadPresetChange(e.target.value)}
          placeholder="Preset d'upload non signé"
          required
        />
        <p className="text-xs text-muted-foreground">
          Note: Assurez-vous que ce preset est configuré comme "non signé" dans votre compte Cloudinary.
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
  );
};

export default CloudinaryConfigForm;
