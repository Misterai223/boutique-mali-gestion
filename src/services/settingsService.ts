
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const settingsService = {
  async uploadLogo(file: File): Promise<string | null> {
    try {
      // Vérifier si le bucket 'logos' existe, sinon le créer
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'logos');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('logos', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `shop_logo_${Date.now()}.${fileExt}`;
      
      const { error, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);
      
      // Sauvegarder l'URL dans localStorage pour l'utiliser dans l'application
      localStorage.setItem('shopLogo', publicUrl);
      
      toast.success("Logo téléchargé avec succès");
      return publicUrl;
    } catch (error: any) {
      toast.error(`Erreur lors du téléchargement du logo: ${error.message}`);
      return null;
    }
  },
  
  async getLogos(): Promise<string[]> {
    try {
      // Vérifier si le bucket 'logos' existe, sinon le créer
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'logos');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('logos', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        return [];
      }
      
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
    } catch (error: any) {
      toast.error(`Erreur lors de la récupération des logos: ${error.message}`);
      return [];
    }
  },
  
  async deleteLogoByUrl(url: string): Promise<boolean> {
    try {
      // Extraire le nom du fichier de l'URL
      const fileName = url.split('/').pop();
      
      if (!fileName) throw new Error("Impossible d'extraire le nom du fichier");
      
      const { error } = await supabase.storage
        .from('logos')
        .remove([fileName]);
      
      if (error) throw error;
      
      toast.success("Logo supprimé avec succès");
      return true;
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression du logo: ${error.message}`);
      return false;
    }
  }
};
