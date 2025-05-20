
import { initializeSupabase } from "./supabaseSetup";

export const initializeApp = async () => {
  try {
    console.log("Initialisation de l'application...");
    
    // Réinitialiser l'état d'authentification au démarrage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessLevel");
    
    // Initialiser Supabase sans vérification de connexion
    await initializeSupabase();
    console.log("Application initialisée avec succès");
    
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
  }
};
