
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthChangeEvent, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

export const authService = {
  // Nouvelle méthode simplifiée pour la connexion
  async simpleLogin(email: string, password: string) {
    try {
      console.log("Tentative de connexion avec email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Erreur d'authentification Supabase:", error);
        
        // Messages d'erreur plus conviviaux
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect");
          return { 
            data: null, 
            error: new Error("Email ou mot de passe incorrect") 
          };
        }
        
        toast.error(error.message || "Erreur de connexion");
        return { data: null, error };
      }
      
      // Si nous avons une session, c'est un succès
      if (data.session) {
        console.log("Authentification réussie");
        localStorage.setItem("isAuthenticated", "true");
        
        // Récupération des données de profil
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role, access_level')
            .eq('id', data.user.id)
            .maybeSingle();
          
          if (profileData) {
            localStorage.setItem("userRole", profileData.role);
            localStorage.setItem("accessLevel", profileData.access_level.toString());
            console.log("Profil utilisateur chargé:", profileData);
          } else {
            // Valeurs par défaut si pas de profil
            localStorage.setItem("userRole", "user");
            localStorage.setItem("accessLevel", "1");
          }
        } catch (profileError) {
          console.warn("Erreur lors de la récupération du profil:", profileError);
          // Valeurs par défaut en cas d'erreur
          localStorage.setItem("userRole", "user");
          localStorage.setItem("accessLevel", "1");
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception lors de la connexion:", error);
      toast.error("Une erreur inattendue s'est produite");
      return { 
        data: null, 
        error: new Error("Une erreur inattendue s'est produite") 
      };
    }
  },
  
  async loginWithErrorHandling(email: string, password: string): Promise<{
    data: { session: Session | null; user: User | null } | null;
    error: AuthError | Error | null;
  }> {
    try {
      console.log("Tentative de connexion avec email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erreur de connexion Supabase:", error);
        
        // Message d'erreur plus détaillé et convivial
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
      
      // Récupérer le profil utilisateur après connexion
      if (data.session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, access_level')
            .eq('id', data.user.id)
            .maybeSingle(); // Utiliser maybeSingle au lieu de single pour éviter l'erreur s'il n'y a pas de profil
            
          if (!profileError && profileData) {
            localStorage.setItem("userRole", profileData.role);
            localStorage.setItem("accessLevel", profileData.access_level.toString());
            console.log("Profil utilisateur chargé:", profileData);
          } else if (profileError) {
            console.warn("Impossible de récupérer le profil:", profileError);
            // Définir un rôle par défaut en cas d'erreur pour ne pas bloquer la connexion
            localStorage.setItem("userRole", "user");
            localStorage.setItem("accessLevel", "1");
          } else {
            // Si l'utilisateur n'a pas de profil, on définit un rôle par défaut
            console.log("Aucun profil trouvé pour l'utilisateur. Utilisation des valeurs par défaut");
            localStorage.setItem("userRole", "user");
            localStorage.setItem("accessLevel", "1");
          }
        } catch (profileFetchError) {
          console.error("Erreur lors de la récupération du profil:", profileFetchError);
          // Ne pas bloquer la connexion pour un problème de profil
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
  },
  
  async login(email: string, password: string): Promise<boolean> {
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
        // Vérifier explicitement que la session est établie
        localStorage.setItem("isAuthenticated", "true");
        
        // Récupérer le profil utilisateur
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
  },
  
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("accessLevel");
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      toast.error(`Erreur de déconnexion: ${error.message}`);
    }
  },
  
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erreur de récupération de session:", error);
        throw error;
      }
      
      return data.session;
    } catch (error) {
      console.error("Erreur de récupération de session:", error);
      return null;
    }
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      // Récupérer le rôle utilisateur s'il n'est pas déjà dans localStorage
      if (data.user && !localStorage.getItem("userRole")) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, access_level')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (!profileError && profileData) {
          localStorage.setItem("userRole", profileData.role);
          localStorage.setItem("accessLevel", profileData.access_level.toString());
        }
      }
      
      return data.user;
    } catch (error) {
      console.error("Erreur de récupération d'utilisateur:", error);
      return null;
    }
  },
  
  subscribeToAuthChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
  
  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Vérifier le mot de passe actuel
      const user = await this.getCurrentUser();
      if (!user || !user.email) {
        toast.error("Aucun utilisateur connecté");
        return false;
      }
      
      // Tentative de connexion avec le mot de passe actuel pour vérification
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        toast.error("Mot de passe actuel incorrect");
        return false;
      }
      
      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Mot de passe mis à jour avec succès");
      return true;
    } catch (error: any) {
      toast.error(`Erreur de mise à jour du mot de passe: ${error.message}`);
      return false;
    }
  }
};
