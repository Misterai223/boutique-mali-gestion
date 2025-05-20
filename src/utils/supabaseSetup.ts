
import { supabase } from '@/integrations/supabase/client';

/**
 * Cette fonction doit être appelée au démarrage de l'application
 */
export async function initializeSupabase() {
  try {
    console.log("Initialisation de Supabase...");
    
    // Vérification simple de la connexion à Supabase
    const { error } = await supabase.from('_health').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 est l'erreur pour une table non existante, ce qui est normal pour '_health'
      console.warn("La vérification de santé a échoué:", error);
    } else {
      console.log("Connexion à Supabase établie avec succès");
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
  }
}
