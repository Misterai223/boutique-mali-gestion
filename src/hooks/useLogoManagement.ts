
import { useState, useEffect } from "react";
import { settingsService } from "@/services/settingsService";
import { toast } from "sonner";

export const useLogoManagement = () => {
  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  useEffect(() => {
    fetchLogos();
    
    // Get the current logo from localStorage
    const storedLogo = localStorage.getItem("shopLogo");
    if (storedLogo) {
      setCurrentLogo(storedLogo);
    }
    
    // Écouter les changements de logo dans le localStorage
    const handleStorageEvent = () => {
      const logo = localStorage.getItem("shopLogo");
      if (logo) {
        setCurrentLogo(logo);
      } else {
        setCurrentLogo(null);
      }
    };
    
    // Écouter l'événement personnalisé pour les mises à jour du localStorage
    document.addEventListener('localStorage.updated', handleStorageEvent);
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      document.removeEventListener('localStorage.updated', handleStorageEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const fetchLogos = async () => {
    setIsLoading(true);
    try {
      // Use Supabase
      const urls = await settingsService.getLogos();
      
      // Ajouter également le logo actuellement stocké dans localStorage s'il existe
      const currentLogoFromStorage = localStorage.getItem("shopLogo");
      
      if (currentLogoFromStorage && currentLogoFromStorage.startsWith('data:image')) {
        // C'est une image en base64, on l'ajoute à la liste
        const allUrls = [currentLogoFromStorage, ...urls];
        // Dédupliquer
        setLogoUrls([...new Set(allUrls)]);
      } else {
        setLogoUrls(urls);
      }
    } catch (error) {
      console.error("Error retrieving logos:", error);
      
      // Fallback: utiliser le localStorage
      const currentLogoFromStorage = localStorage.getItem("shopLogo");
      if (currentLogoFromStorage) {
        setLogoUrls([currentLogoFromStorage]);
      }
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
      // Try using Supabase first
      const url = await settingsService.uploadLogo(file);
      
      if (url) {
        // Refresh the full list to ensure consistency
        await fetchLogos();
        // Set as current logo
        handleSelectLogo(url);
        toast.success("Logo téléchargé avec succès");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
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
      // Delete using Supabase
      const success = await settingsService.deleteLogoByUrl(url);
      if (success) {
        setLogoUrls(logoUrls.filter(logoUrl => logoUrl !== url));
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
        await fetchLogos(); // Refresh the list
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
    handleFileChange,
    handleSelectLogo,
    handleDeleteLogo,
    fetchLogos
  };
};
