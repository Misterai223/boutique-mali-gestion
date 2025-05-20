
import { toast } from "sonner";

/**
 * Simplified authentication functions without Supabase
 */

// Simple login method with no database connection
export async function simpleLogin(email, password) {
  try {
    console.log("Tentative de connexion avec email:", email);
    
    // Utilisateur "admin@example.com" avec mot de passe "password" autorisé
    if (email === "admin@example.com" && password === "password") {
      console.log("Authentification réussie");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("accessLevel", "5");
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { 
        data: { 
          session: { user: { email } },
          user: { email }
        }, 
        error: null 
      };
    }
    
    return { 
      data: null, 
      error: new Error("Email ou mot de passe incorrect") 
    };
  } catch (error) {
    console.error("Exception lors de la connexion:", error);
    return { 
      data: null, 
      error: new Error("Une erreur inattendue s'est produite") 
    };
  }
}
