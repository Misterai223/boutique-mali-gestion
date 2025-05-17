
import { initializeSupabase } from "./supabaseSetup";

export const initializeApp = () => {
  try {
    // Initialiser les buckets Supabase
    initializeSupabase();
    console.log("Supabase initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase:", error);
  }
};
