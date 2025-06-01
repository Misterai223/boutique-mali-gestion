
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Advanced login functions with comprehensive error handling
 */

// Login with detailed error handling
export async function loginWithErrorHandling(email: string, password: string) {
  try {
    console.log("=== DÉBUT DE LA CONNEXION ===");
    console.log("Email utilisé:", email);
    console.log("Configuration Supabase:", {
      url: "https://jnvtgxdnoenmgrxizmxj.supabase.co",
      hasClient: !!supabase
    });
    
    // Test de la connexion Supabase d'abord
    console.log("Test de la connexion à Supabase...");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    console.log("Réponse de Supabase:", { data: !!data, error: error?.message });
    
    if (error) {
      console.error("=== ERREUR SUPABASE ===");
      console.error("Code d'erreur:", error.message);
      console.error("Détails complets:", error);
      
      // Gestion d'erreurs plus spécifique
      if (error.message.includes("Invalid login credentials")) {
        return { 
          data: null, 
          error: new Error("Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.") 
        };
      }
      
      if (error.message.includes("Email not confirmed")) {
        return { 
          data: null, 
          error: new Error("Veuillez confirmer votre email avant de vous connecter.") 
        };
      }
      
      if (error.message.includes("Too many requests")) {
        return { 
          data: null, 
          error: new Error("Trop de tentatives de connexion. Veuillez patienter quelques minutes.") 
        };
      }
      
      if (error.message.includes("Network")) {
        return { 
          data: null, 
          error: new Error("Problème de connexion réseau. Vérifiez votre connexion internet.") 
        };
      }
      
      // Erreur générique avec plus de détails
      return { 
        data: null, 
        error: new Error(`Erreur de connexion: ${error.message}`) 
      };
    }
    
    if (!data.session) {
      console.error("=== AUCUNE SESSION CRÉÉE ===");
      return { 
        data: null, 
        error: new Error("Impossible d'établir la session. Veuillez réessayer.") 
      };
    }
    
    console.log("=== CONNEXION RÉUSSIE ===");
    console.log("Utilisateur:", data.user.email);
    console.log("Session créée:", !!data.session);
    
    // Get user profile after login
    try {
      console.log("Récupération du profil utilisateur...");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, access_level')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.warn("Erreur lors de la récupération du profil:", profileError);
        // Don't block login if profile retrieval fails
        localStorage.setItem("userRole", "user");
        localStorage.setItem("accessLevel", "1");
      } else if (profileData) {
        console.log("Profil utilisateur récupéré:", profileData);
        localStorage.setItem("userRole", profileData.role);
        localStorage.setItem("accessLevel", profileData.access_level.toString());
      } else {
        console.log("Aucun profil trouvé, utilisation des valeurs par défaut");
        localStorage.setItem("userRole", "user");
        localStorage.setItem("accessLevel", "1");
      }
    } catch (profileFetchError) {
      console.error("Exception lors de la récupération du profil:", profileFetchError);
      localStorage.setItem("userRole", "user");
      localStorage.setItem("accessLevel", "1");
    }
    
    return { data, error: null };
  } catch (exception: any) {
    console.error("=== EXCEPTION DURANT LA CONNEXION ===");
    console.error("Exception:", exception);
    console.error("Stack trace:", exception.stack);
    
    return { 
      data: null, 
      error: new Error("Erreur technique inattendue. Vérifiez la console pour plus de détails.") 
    };
  }
}

// Basic login function for simpler use cases
export async function login(email: string, password: string): Promise<boolean> {
  try {
    console.log("Login simple pour:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    
    if (error) {
      console.error("Erreur de connexion simple:", error);
      return false;
    }
    
    if (data.session) {
      console.log("Session établie avec succès");
      localStorage.setItem("isAuthenticated", "true");
      
      // Get user profile
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, access_level')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (profileData) {
          localStorage.setItem("userRole", profileData.role);
          localStorage.setItem("accessLevel", profileData.access_level.toString());
        } else {
          localStorage.setItem("userRole", "user");
          localStorage.setItem("accessLevel", "1");
        }
      } catch (profileError) {
        console.warn("Erreur lors de la récupération du profil:", profileError);
        localStorage.setItem("userRole", "user");
        localStorage.setItem("accessLevel", "1");
      }
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Erreur de connexion:", error);
    return false;
  }
}
