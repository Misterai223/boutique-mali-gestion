
import { supabase } from '@/integrations/supabase/client';

/**
 * Cette fonction doit être appelée au démarrage de l'application
 */
export async function initializeSupabase() {
  try {
    console.log("Initialisation de Supabase...");
    
    // Vérification simple de la connexion à Supabase en utilisant la table profiles
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      console.warn("La vérification de connexion Supabase a échoué:", error);
      return false;
    } else {
      console.log("Connexion à Supabase établie avec succès");
      return true;
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
    return false;
  }
}
