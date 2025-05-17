
import { cloudinaryClient, isCloudinaryConfigured } from '@/integrations/cloudinary/client';
import { toast } from 'sonner';

// Configuration et types
interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'raw' | 'video' | 'auto';
  tags?: string[];
  publicId?: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  created_at: string;
  tags?: string[];
}

export const cloudinaryService = {
  /**
   * Vérifie si Cloudinary est correctement configuré
   */
  isConfigured: (): boolean => {
    return isCloudinaryConfigured();
  },

  /**
   * Configure les identifiants Cloudinary
   */
  configureCredentials: (cloudName: string, apiKey: string, apiSecret: string): void => {
    localStorage.setItem('CLOUDINARY_CLOUD_NAME', cloudName);
    localStorage.setItem('CLOUDINARY_API_KEY', apiKey);
    localStorage.setItem('CLOUDINARY_API_SECRET', apiSecret);
    toast.success('Identifiants Cloudinary enregistrés');
  },

  /**
   * Télécharge un fichier sur Cloudinary
   */
  uploadFile: async (file: File, options: UploadOptions = {}): Promise<string | null> => {
    if (!isCloudinaryConfigured()) {
      toast.error('Cloudinary n\'est pas configuré. Veuillez configurer vos identifiants.');
      return null;
    }

    try {
      // Cette fonction utilise l'API Upload de Cloudinary directement via le frontend
      // Remarque: En production, cette opération devrait idéalement être effectuée via le backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'shop_manager_upload'); // Preset non signé configuré dans Cloudinary
      formData.append('cloud_name', localStorage.getItem('CLOUDINARY_CLOUD_NAME') || '');
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }
      
      if (options.publicId) {
        formData.append('public_id', options.publicId);
      }

      // URL de l'API d'upload de Cloudinary
      const cloudName = localStorage.getItem('CLOUDINARY_CLOUD_NAME');
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement sur Cloudinary:', error);
      toast.error(`Erreur de téléchargement: ${error.message}`);
      return null;
    }
  },

  /**
   * Récupère tous les fichiers d'un dossier spécifique
   */
  getFilesByFolder: async (folder: string): Promise<string[]> => {
    try {
      // Cette fonction devrait idéalement être implémentée via le backend
      // Pour le moment, nous allons utiliser une approche simplifiée
      // Note: Cela nécessiterait d'implémenter une fonction backend ou un edge function avec Supabase
      
      console.log(`Recherche des fichiers dans le dossier ${folder} (fonctionnalité limitée en frontend)`);
      
      // En production, il faudrait faire une requête à un backend qui utilise l'Admin API de Cloudinary
      // Pour le MVP, nous pouvons stocker les URLs des fichiers uploadés dans localStorage
      const storedUrls = localStorage.getItem(`cloudinary_${folder}_files`);
      return storedUrls ? JSON.parse(storedUrls) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      return [];
    }
  },

  /**
   * Supprime une ressource de Cloudinary
   */
  deleteResource: async (publicId: string): Promise<boolean> => {
    // Cette fonction doit être implémentée côté serveur pour des raisons de sécurité
    // Pour le moment, nous allons simuler la suppression en frontend
    console.log(`Suppression de la ressource ${publicId} (simulée)`);
    
    // En production, il faudrait implémenter cette fonction via un backend
    toast.warning('La suppression nécessite une implémentation backend');
    
    return false;
  },
  
  /**
   * Sauvegarde l'URL d'un fichier téléchargé dans le stockage local par catégorie
   */
  saveUploadedFileUrl: (category: string, url: string): void => {
    const key = `cloudinary_${category}_files`;
    const existingUrls = localStorage.getItem(key);
    const urls = existingUrls ? JSON.parse(existingUrls) : [];
    
    if (!urls.includes(url)) {
      urls.push(url);
      localStorage.setItem(key, JSON.stringify(urls));
    }
  },
  
  /**
   * Supprime une URL du stockage local
   */
  removeFileUrl: (category: string, url: string): boolean => {
    const key = `cloudinary_${category}_files`;
    const existingUrls = localStorage.getItem(key);
    
    if (existingUrls) {
      const urls = JSON.parse(existingUrls);
      const updatedUrls = urls.filter((existingUrl: string) => existingUrl !== url);
      localStorage.setItem(key, JSON.stringify(updatedUrls));
      return true;
    }
    
    return false;
  }
};
