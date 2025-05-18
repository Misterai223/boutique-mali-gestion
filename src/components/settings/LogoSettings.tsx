
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLogoManagement } from "@/hooks/useLogoManagement";
import LogoUploader from "@/components/settings/logos/LogoUploader";
import LogoGallery from "@/components/settings/logos/LogoGallery";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

const LogoSettings = () => {
  const {
    logoUrls,
    isLoading,
    isUploading,
    currentLogo,
    handleFileChange,
    handleSelectLogo,
    handleDeleteLogo,
    handleCloudinaryUploadComplete
  } = useLogoManagement();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <CardTitle>Gestion des logos</CardTitle>
          </div>
          <CardDescription>
            Téléchargez et gérez les logos de votre entreprise
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Télécharger un nouveau logo</h3>
              
              <LogoUploader 
                isUploading={isUploading}
                onFileChange={handleFileChange}
                onMediaLibrarySelect={handleSelectLogo}
                onCloudinaryUploadComplete={handleCloudinaryUploadComplete}
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vos logos</h3>
              
              <LogoGallery
                logoUrls={logoUrls}
                currentLogo={currentLogo}
                isLoading={isLoading}
                onSelectLogo={handleSelectLogo}
                onDeleteLogo={handleDeleteLogo}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LogoSettings;
