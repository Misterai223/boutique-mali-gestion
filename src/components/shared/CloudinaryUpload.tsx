
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cloudinaryService } from "@/services/cloudinaryService";
import { Upload, X } from "lucide-react";

interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  buttonText?: string;
  category: string;
  className?: string;
  accept?: string;
}

const CloudinaryUpload = ({
  onUploadComplete,
  folder = "general",
  buttonText = "Télécharger",
  category,
  className = "",
  accept = "image/*"
}: CloudinaryUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Vérifier si Cloudinary est configuré
    if (!cloudinaryService.isConfigured()) {
      toast.error("Cloudinary n'est pas configuré. Veuillez configurer vos identifiants dans les paramètres.");
      return;
    }
    
    // Vérifier la taille du fichier (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Le fichier est trop volumineux (maximum 10MB).");
      return;
    }
    
    setIsUploading(true);
    try {
      const url = await cloudinaryService.uploadFile(file, {
        folder: folder,
        resourceType: 'image',
        tags: [category]
      });
      
      if (url) {
        // Sauvegarder l'URL dans le stockage local
        cloudinaryService.saveUploadedFileUrl(category, url);
        
        // Notifier le composant parent
        onUploadComplete(url);
        toast.success("Fichier téléchargé avec succès");
      }
    } catch (error: any) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Réinitialiser l'input de fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (!cloudinaryService.isConfigured()) {
      toast.error("Cloudinary n'est pas configuré. Veuillez configurer vos identifiants dans les paramètres.");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <div className="flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Téléchargement...
          </div>
        ) : (
          <div className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            {buttonText}
          </div>
        )}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />
    </div>
  );
};

export default CloudinaryUpload;
