
import { initializeSupabase } from "./supabaseSetup";

export const initializeApp = async () => {
  try {
    console.log("Initialisation de l'application...");
    
    // Réinitialiser l'état d'authentification au démarrage pour éviter les problèmes
    const storedAuth = localStorage.getItem("isAuthenticated");
    
    // Si nous avons une incohérence entre localStorage et l'état réel, nettoyons
    if (storedAuth === "true") {
      console.log("État d'authentification trouvé, vérification de la session...");
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("Session invalide détectée, nettoyage...");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");
          localStorage.removeItem("accessLevel");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
        // En cas d'erreur, supprimer les données d'authentification par sécurité
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("accessLevel");
      }
    }
    
    // Initialiser Supabase
    await initializeSupabase();
    console.log("Supabase initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
  }
};
