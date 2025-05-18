
import { supabase } from '@/integrations/supabase/client';

/**
 * Cette fonction doit être appelée au démarrage de l'application
 * mais n'est plus nécessaire car nous utilisons maintenant Cloudinary
 * pour le stockage des fichiers.
 */
export async function initializeSupabase() {
  // Nous n'avons plus besoin d'initialiser les buckets Supabase
  console.log("Supabase initialized - using Cloudinary for file storage");
}
