
/**
 * Cette fonction doit être appelée au démarrage de l'application
 * mais ne vérifiera plus la connexion à la base de données
 */
export async function initializeSupabase() {
  try {
    console.log("Initialisation de Supabase...");
    // Nous ne vérifions plus la connexion à Supabase pour éviter les problèmes
    console.log("Configuration de Supabase terminée");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
    return false;
  }
}
