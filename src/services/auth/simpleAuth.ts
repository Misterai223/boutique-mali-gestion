
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Simplified authentication functions focused on basic login functionality
 */

// Simple login method with minimal overhead
export async function simpleLogin(email: string, password: string) {
  try {
    console.log("Tentative de connexion avec email:", email);
    
    // Nettoyage préventif de tout état d'authentification précédent
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessLevel");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Erreur d'authentification Supabase:", error);
      
      // User-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        return { 
          data: null, 
          error: new Error("Email ou mot de passe incorrect") 
        };
      }
      
      return { data: null, error };
    }
    
    // On successful session establishment
    if (data.session) {
      console.log("Authentification réussie");
      localStorage.setItem("isAuthenticated", "true");
      
      // Retrieve user profile data
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, access_level')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileData) {
          localStorage.setItem("userRole", profileData.role);
          localStorage.setItem("accessLevel", profileData.access_level.toString());
          console.log("Profil utilisateur chargé:", profileData);
        } else {
          console.warn("Aucun profil trouvé ou erreur:", profileError);
          // Default values if no profile exists
          localStorage.setItem("userRole", "user");
          localStorage.setItem("accessLevel", "1");
        }
      } catch (profileError) {
        console.warn("Erreur lors de la récupération du profil:", profileError);
        // Default values in case of error
        localStorage.setItem("userRole", "user");
        localStorage.setItem("accessLevel", "1");
      }
      
      return { data, error: null };
    } else {
      console.error("Session non établie malgré une réponse sans erreur");
      return { 
        data: null, 
        error: new Error("Impossible d'établir la session. Veuillez réessayer.") 
      };
    }
  } catch (error: any) {
    console.error("Exception lors de la connexion:", error);
    return { 
      data: null, 
      error: new Error("Une erreur inattendue s'est produite") 
    };
  }
}
