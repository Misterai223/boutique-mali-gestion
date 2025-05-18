
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cloudinaryService } from "@/services/cloudinaryService";

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
      // Get Cloudinary logos
      let cloudinaryUrls: string[] = [];
      try {
        const storedCloudinaryUrls = localStorage.getItem('cloudinary_logos_files');
        if (storedCloudinaryUrls) {
          cloudinaryUrls = JSON.parse(storedCloudinaryUrls);
        }
      } catch (error) {
        console.error("Error fetching Cloudinary logos:", error);
      }
      
      // Ajouter également le logo actuellement stocké dans localStorage s'il existe
      const currentLogoFromStorage = localStorage.getItem("shopLogo");
      
      if (currentLogoFromStorage) {
        // Vérifier si le logo est déjà dans la liste
        if (!cloudinaryUrls.includes(currentLogoFromStorage)) {
          cloudinaryUrls.unshift(currentLogoFromStorage);
        }
      }
      
      // Dédupliquer les URLs
      setLogoUrls([...new Set(cloudinaryUrls)]);
      
    } catch (error) {
      console.error("Error retrieving logos:", error);
      
      // Fallback: utiliser le localStorage
      const currentLogoFromStorage = localStorage.getItem("shopLogo");
      if (currentLogoFromStorage) {
        setLogoUrls([currentLogoFromStorage]);
      }
      
      // Check for Cloudinary logos as fallback
      try {
        const storedCloudinaryUrls = localStorage.getItem('cloudinary_logos_files');
        if (storedCloudinaryUrls) {
          const cloudinaryUrls = JSON.parse(storedCloudinaryUrls);
          setLogoUrls(prev => [...new Set([...prev, ...cloudinaryUrls])]);
        }
      } catch (error) {
        console.error("Error fetching fallback Cloudinary logos:", error);
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
      // Check if Cloudinary is configured
      if (!cloudinaryService.isConfigured()) {
        toast.error("Cloudinary n'est pas configuré. Veuillez configurer Cloudinary dans les paramètres.");
        return;
      }
      
      // Upload to Cloudinary
      const url = await cloudinaryService.uploadFile(file, {
        folder: 'logos',
        tags: ['logo']
      });
      
      if (url) {
        // Store in cloudinary logos list
        const storedUrls = localStorage.getItem('cloudinary_logos_files');
        const urls = storedUrls ? JSON.parse(storedUrls) : [];
        if (!urls.includes(url)) {
          urls.unshift(url);
          localStorage.setItem('cloudinary_logos_files', JSON.stringify(urls));
        }
        
        // Set as current logo
        handleSelectLogo(url);
        
        // Refresh the list
        await fetchLogos();
        
        toast.success("Logo téléchargé avec succès via Cloudinary");
      } else {
        // Fallback to base64 if Cloudinary upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          localStorage.setItem('shopLogo', base64data);
          
          // Set as current logo
          handleSelectLogo(base64data);
          
          // Refresh the list
          fetchLogos();
          
          toast.success("Logo enregistré en local (mode hors ligne)");
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement du logo. Veuillez réessayer.");
      
      // Fallback to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem('shopLogo', base64data);
        
        // Set as current logo
        handleSelectLogo(base64data);
        
        // Refresh the list
        fetchLogos();
        
        toast.success("Logo enregistré en local (mode hors ligne)");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloudinaryUploadComplete = async (url: string) => {
    if (url) {
      // Store in cloudinary logos list
      const storedUrls = localStorage.getItem('cloudinary_logos_files');
      const urls = storedUrls ? JSON.parse(storedUrls) : [];
      if (!urls.includes(url)) {
        urls.unshift(url);
        localStorage.setItem('cloudinary_logos_files', JSON.stringify(urls));
      }
      
      // Set as current logo
      handleSelectLogo(url);
      
      // Refresh the list
      await fetchLogos();
      
      toast.success("Logo téléchargé via Cloudinary avec succès");
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
      let success = false;
      
      // Check if it's a Cloudinary URL
      if (url.includes('cloudinary')) {
        // Remove from Cloudinary local storage
        const storedUrls = localStorage.getItem('cloudinary_logos_files');
        if (storedUrls) {
          const urls = JSON.parse(storedUrls);
          const newUrls = urls.filter((logoUrl: string) => logoUrl !== url);
          localStorage.setItem('cloudinary_logos_files', JSON.stringify(newUrls));
          success = true;
        }
      }
      // For base64 images or other types
      else {
        // We can always delete from our list
        success = true;
      }
      
      // If the deleted logo is the current logo, reset
      if (url === currentLogo) {
        localStorage.removeItem("shopLogo");
        setCurrentLogo(null);
        
        // Dispatch a custom event to notify other components of the changes
        const event = new Event('localStorage.updated');
        document.dispatchEvent(event);
      }
      
      // Update the list
      setLogoUrls(logoUrls.filter(logoUrl => logoUrl !== url));
      
      if (success) {
        toast.success("Logo supprimé avec succès");
        await fetchLogos(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Erreur lors de la suppression du logo");
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
    handleCloudinaryUploadComplete,
    fetchLogos
  };
};
