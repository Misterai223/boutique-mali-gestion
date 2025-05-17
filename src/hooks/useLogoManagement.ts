
import { useState, useEffect } from "react";
import { settingsService } from "@/services/settingsService";
import { cloudinaryService } from "@/services/cloudinaryService";
import { toast } from "sonner";

export const useLogoManagement = () => {
  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [useCloudinary, setUseCloudinary] = useState(false);

  useEffect(() => {
    // Check if Cloudinary is configured
    const isCloudinaryReady = cloudinaryService.isConfigured();
    setUseCloudinary(isCloudinaryReady);
    
    fetchLogos();
    
    // Get the current logo from localStorage
    const storedLogo = localStorage.getItem("shopLogo");
    if (storedLogo) {
      setCurrentLogo(storedLogo);
    }
  }, []);

  const fetchLogos = async () => {
    setIsLoading(true);
    try {
      let urls: string[] = [];
      
      if (useCloudinary) {
        // Use Cloudinary
        urls = await cloudinaryService.getFilesByFolder('logos');
      } else {
        // Fallback to Supabase
        urls = await settingsService.getLogos();
      }
      
      setLogoUrls(urls);
    } catch (error) {
      console.error("Error retrieving logos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
      toast.error("Format de fichier non supporté. Veuillez utiliser JPG, PNG, GIF ou SVG.");
      return;
    }
    
    // Check size (maximum 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux. 5MB maximum.");
      return;
    }
    
    setIsUploading(true);
    try {
      let url: string | null = null;
      
      if (useCloudinary) {
        // Use Cloudinary
        url = await cloudinaryService.uploadFile(file, {
          folder: 'logos',
          resourceType: 'image',
        });
        
        if (url) {
          cloudinaryService.saveUploadedFileUrl('logos', url);
        }
      } else {
        // Fallback to Supabase
        url = await settingsService.uploadLogo(file);
      }
      
      if (url) {
        toast.success("Logo téléchargé avec succès");
        // Refresh the full list to ensure consistency
        await fetchLogos();
        // Set as current logo
        handleSelectLogo(url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloudinaryUploadComplete = (url: string) => {
    // Update the logo list
    const newLogoUrls = [...logoUrls, url];
    setLogoUrls(newLogoUrls);
    // Set as current logo
    handleSelectLogo(url);
  };

  const handleSelectLogo = (url: string) => {
    setCurrentLogo(url);
    localStorage.setItem("shopLogo", url);
    
    // Dispatch a custom event to notify other components of the changes
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
    toast.success("Logo défini comme logo actuel");
  };

  const handleDeleteLogo = async (url: string) => {
    try {
      let success = false;
      
      if (useCloudinary && url.includes('cloudinary')) {
        // Delete on Cloudinary (simulation)
        success = cloudinaryService.removeFileUrl('logos', url);
        if (success) {
          // Update the logo list locally
          setLogoUrls(logoUrls.filter(logoUrl => logoUrl !== url));
        }
      } else {
        // Fallback to Supabase
        success = await settingsService.deleteLogoByUrl(url);
        if (success) {
          setLogoUrls(logoUrls.filter(logoUrl => logoUrl !== url));
        }
      }
      
      // If the deleted logo is the current logo, reset
      if (url === currentLogo) {
        localStorage.removeItem("shopLogo");
        setCurrentLogo(null);
        
        // Dispatch a custom event to notify other components of the changes
        const event = new Event('localStorage.updated');
        document.dispatchEvent(event);
      }
      
      if (success) {
        toast.success("Logo supprimé avec succès");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return {
    logoUrls,
    isLoading,
    isUploading,
    currentLogo,
    useCloudinary,
    handleFileChange,
    handleCloudinaryUploadComplete,
    handleSelectLogo,
    handleDeleteLogo,
    fetchLogos
  };
};
