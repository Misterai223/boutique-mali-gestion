
import { 
  isCloudinaryConfigured, 
  getCloudName, 
  getApiKey, 
  getUploadUrl, 
  getUploadPreset,
  configureCloudinary 
} from '@/integrations/cloudinary/client';
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
    const configured = isCloudinaryConfigured();
    console.log('Cloudinary configuré:', configured);
    return configured;
  },

  /**
   * Configure les identifiants Cloudinary
   */
  configureCredentials: (cloudName: string, apiKey: string, apiSecret: string, uploadPreset?: string): void => {
    configureCloudinary(cloudName, apiKey, apiSecret, uploadPreset);
    console.log('✅ Identifiants Cloudinary mis à jour');
    toast.success('Identifiants Cloudinary enregistrés');
  },

  /**
   * Télécharge un fichier sur Cloudinary
   */
  uploadFile: async (file: File, options: UploadOptions = {}): Promise<string | null> => {
    console.log('=== DÉBUT UPLOAD CLOUDINARY ===');
    console.log('Fichier:', file.name, 'Taille:', file.size);
    
    if (!isCloudinaryConfigured()) {
      toast.error('Cloudinary n\'est pas configuré. Veuillez configurer vos identifiants.');
      return null;
    }

    try {
      // Création du FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', getUploadPreset());
      formData.append('cloud_name', getCloudName());
      
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
      const uploadUrl = getUploadUrl();
      console.log('Upload URL:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      console.log('Réponse Cloudinary:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur Cloudinary:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Upload réussi:', data.secure_url);
      
      return data.secure_url;
    } catch (error: any) {
      console.error('=== ERREUR UPLOAD CLOUDINARY ===');
      console.error('Erreur:', error);
      toast.error(`Erreur de téléchargement: ${error.message}`);
      return null;
    }
  },

  /**
   * Récupère tous les fichiers d'un dossier spécifique
   */
  getFilesByFolder: async (folder: string): Promise<string[]> => {
    try {
      console.log(`Recherche des fichiers dans le dossier ${folder}`);
      
      // En production, il faudrait faire une requête à un backend qui utilise l'Admin API de Cloudinary
      // Pour le MVP, nous utilisons le stockage local
      const storedUrls = localStorage.getItem(`cloudinary_${folder}_files`);
      const urls = storedUrls ? JSON.parse(storedUrls) : [];
      
      console.log(`Fichiers trouvés dans ${folder}:`, urls.length);
      return urls;
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      return [];
    }
  },

  /**
   * Supprime une ressource de Cloudinary
   */
  deleteResource: async (publicId: string): Promise<boolean> => {
    console.log(`Tentative de suppression de la ressource ${publicId}`);
    
    // Cette fonction doit être implémentée côté serveur pour des raisons de sécurité
    // Pour le moment, nous simulons la suppression
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
      console.log(`✅ URL sauvegardée dans ${category}:`, url);
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
      console.log(`✅ URL supprimée de ${category}:`, url);
      return true;
    }
    
    return false;
  }
};
