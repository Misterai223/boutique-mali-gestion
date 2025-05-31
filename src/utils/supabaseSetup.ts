
/**
 * Cette fonction initialise la connexion à Supabase
 */
export async function initializeSupabase() {
  try {
    console.log("Initialisation de Supabase...");
    // La connexion à Supabase est automatiquement gérée par le client
    console.log("Configuration de Supabase terminée");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
    return false;
  }
}
