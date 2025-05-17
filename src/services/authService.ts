
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthChangeEvent, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

export const authService = {
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
          } else if (profileError && !profileError.message.includes("JSON object requested, multiple (or no) rows returned")) {
            // Signaler uniquement les erreurs qui ne sont pas liées à l'absence de profil
            console.warn("Impossible de récupérer le profil:", profileError);
          } else {
            // Si l'utilisateur n'a pas de profil, on définit un rôle par défaut
            console.log("Aucun profil trouvé pour l'utilisateur. Utilisation des valeurs par défaut");
            localStorage.setItem("userRole", "user");
            localStorage.setItem("accessLevel", "1");
          }
        } catch (profileFetchError) {
          console.error("Erreur lors de la récupération du profil:", profileFetchError);
          // Ne pas bloquer la connexion pour un problème de profil
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
      const result = await this.loginWithErrorHandling(email, password);
      if (result.error) {
        return false;
      }
      
      if (result.data?.session) {
        // Vérifier explicitement que la connexion est établie
        const session = await this.getSession();
        if (session) {
          localStorage.setItem("isAuthenticated", "true");
          return true;
        } else {
          toast.error("Impossible d'initialiser la session");
          return false;
        }
      }
      
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
      
      if (error) throw error;
      
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
          .single();
          
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
