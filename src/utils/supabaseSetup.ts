
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
      try {
        const { error: createError } = await supabase.storage.createBucket('logos', {
          public: true, // Bucket accessible publiquement
          fileSizeLimit: 5242880, // 5MB en octets
        });
        
        if (createError) {
          console.error("Erreur lors de la création du bucket 'logos':", createError);
          
          // Nous supprimons l'appel à create_storage_policy qui cause l'erreur
          // Cette opération nécessite des privilèges administrateur
          // Si nécessaire, l'utilisateur devra configurer manuellement les politiques dans la console Supabase
        } else {
          console.log("Bucket 'logos' créé avec succès");
        }
      } catch (bucketError) {
        // Les erreurs de row-level security peuvent survenir si les autorisations ne sont pas correctement configurées
        console.error("Impossible de créer le bucket (permissions insuffisantes):", bucketError);
        // Ne pas bloquer l'application pour cette erreur
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
  try {
    await setupRequiredBuckets();
    // Vous pouvez ajouter d'autres initialisations ici
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
    // Ne pas bloquer l'application pour cette erreur
  }
}
