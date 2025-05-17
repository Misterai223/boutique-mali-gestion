
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Advanced login functions with comprehensive error handling
 */

// Login with detailed error handling
export async function loginWithErrorHandling(email: string, password: string) {
  try {
    console.log("Tentative de connexion avec email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Erreur de connexion Supabase:", error);
      
      // Detailed and user-friendly error message
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe incorrect. Veuillez réessayer.");
        return { 
          data: null, 
          error: new Error("Email ou mot de passe incorrect. Veuillez réessayer.") 
        };
      }
      
      toast.error(error.message || "Erreur de connexion");
      return { data: null, error };
    }
    
    console.log("Connexion réussie, récupération du profil utilisateur");
    
    // Get user profile after login
    if (data.session) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, access_level')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (!profileError && profileData) {
          localStorage.setItem("userRole", profileData.role);
          localStorage.setItem("accessLevel", profileData.access_level.toString());
          console.log("Profil utilisateur chargé:", profileData);
        } else if (profileError) {
          console.warn("Impossible de récupérer le profil:", profileError);
          // Set default role if error occurs
          localStorage.setItem("userRole", "user");
          localStorage.setItem("accessLevel", "1");
        } else {
          // Set default role if no profile is found
          console.log("Aucun profil trouvé pour l'utilisateur. Utilisation des valeurs par défaut");
          localStorage.setItem("userRole", "user");
          localStorage.setItem("accessLevel", "1");
        }
      } catch (profileFetchError) {
        console.error("Erreur lors de la récupération du profil:", profileFetchError);
        // Don't block login if profile retrieval fails
        localStorage.setItem("userRole", "user");
        localStorage.setItem("accessLevel", "1");
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception lors de la connexion:", error);
    toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
    return { 
      data: null, 
      error: new Error("Une erreur inattendue s'est produite. Veuillez réessayer.") 
    };
  }
}

// Basic login function for simpler use cases
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Erreur de connexion:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(error.message || "Erreur de connexion");
      }
      
      return false;
    }
    
    if (data.session) {
      // Explicitly verify session is established
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
    
    toast.error("Impossible d'établir une session");
    return false;
  } catch (error: any) {
    toast.error(`Erreur de connexion: ${error.message}`);
    return false;
  }
}
