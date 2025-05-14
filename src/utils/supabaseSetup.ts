
import { supabase } from '@/integrations/supabase/client';

/**
 * Vérifie et crée les buckets nécessaires pour l'application
 */
export async function setupRequiredBuckets() {
  try {
    // Récupérer la liste des buckets existants
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Erreur lors de la récupération des buckets:", error);
      return;
    }
    
    // Vérifier si le bucket 'logos' existe
    const logosBucketExists = buckets?.some(bucket => bucket.name === 'logos');
    
    // Créer le bucket 'logos' s'il n'existe pas
    if (!logosBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('logos', {
        public: true, // Bucket accessible publiquement
        fileSizeLimit: 5242880, // 5MB en octets
      });
      
      if (createError) {
        console.error("Erreur lors de la création du bucket 'logos':", createError);
      } else {
        console.log("Bucket 'logos' créé avec succès");
      }
    }
    
    // Vous pouvez ajouter ici d'autres buckets nécessaires
  } catch (error) {
    console.error("Erreur lors de la configuration des buckets:", error);
  }
}

/**
 * Cette fonction doit être appelée au démarrage de l'application
 */
export async function initializeSupabase() {
  await setupRequiredBuckets();
  // Vous pouvez ajouter d'autres initialisations ici
}
