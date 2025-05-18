
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const settingsService = {
  async uploadLogo(file: File): Promise<string | null> {
    try {
      // Vérifier si le bucket 'logos' existe, sinon le créer
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'logos');
      
      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage.createBucket('logos', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (bucketError) {
          console.error("Erreur lors de la création du bucket:", bucketError);
          // Continuer quand même, car l'erreur peut être due aux permissions
          // On va essayer d'uploader directement
        }
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      
      // Ajout de policies "public" pour l'accès sans authentification
      const { error, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Erreur d'upload:", error);
        
        // Alternative: utiliser localStorage pour stocker le logo en base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            localStorage.setItem('shopLogo', base64data);
            
            // Dispatch un événement pour notifier les autres composants
            const event = new Event('localStorage.updated');
            document.dispatchEvent(event);
            
            resolve(base64data);
          };
          reader.readAsDataURL(file);
        });
      }
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);
      
      // Sauvegarder l'URL dans localStorage pour l'utiliser dans l'application
      localStorage.setItem('shopLogo', publicUrl);
      
      // Dispatch un événement pour notifier les autres composants
      const event = new Event('localStorage.updated');
      document.dispatchEvent(event);
      
      toast.success("Logo téléchargé avec succès");
      return publicUrl;
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast.error(`Erreur lors du téléchargement du logo: ${error.message}`);
      return null;
    }
  },
  
  async getLogos(): Promise<string[]> {
    try {
      // Essayer de récupérer depuis Supabase
      try {
        const { data, error } = await supabase.storage
          .from('logos')
          .list();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return [];
        }
        
        // Convertir les objets de fichier en URLs publiques
        const logoUrls = data
          .filter(file => !file.name.endsWith('/')) // Filtrer les dossiers
          .map(file => {
            const { data: { publicUrl } } = supabase.storage
              .from('logos')
              .getPublicUrl(file.name);
            return publicUrl;
          });
        
        return logoUrls;
      } catch (supabaseError) {
        console.warn("Impossible d'utiliser Supabase pour les logos:", supabaseError);
        // Fallback: utiliser localStorage
        return [];
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des logos:", error);
      return [];
    }
  },
  
  async deleteLogoByUrl(url: string): Promise<boolean> {
    try {
      // Si c'est une URL base64
      if (url.startsWith('data:image')) {
        // Supprimer du localStorage uniquement si c'est le logo actuel
        if (localStorage.getItem('shopLogo') === url) {
          localStorage.removeItem('shopLogo');
        }
        toast.success("Logo supprimé avec succès");
        return true;
      }
      
      // Sinon c'est une URL Supabase
      // Extraire le nom du fichier de l'URL
      const fileName = url.split('/').pop();
      
      if (!fileName) throw new Error("Impossible d'extraire le nom du fichier");
      
      try {
        const { error } = await supabase.storage
          .from('logos')
          .remove([fileName]);
        
        if (error) throw error;
      } catch (supabaseError) {
        console.warn("Erreur Supabase:", supabaseError);
        // Même si on ne peut pas le supprimer de Supabase, on peut le supprimer du localStorage
      }
      
      // Supprimer du localStorage si c'est le logo actuel
      const currentLogo = localStorage.getItem('shopLogo');
      if (currentLogo === url) {
        localStorage.removeItem('shopLogo');
        
        // Notifier les autres composants
        const event = new Event('localStorage.updated');
        document.dispatchEvent(event);
      }
      
      toast.success("Logo supprimé avec succès");
      return true;
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression du logo: ${error.message}`);
      return false;
    }
  }
};
