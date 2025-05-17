
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { toast } from "sonner";

export const authService = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Récupérer le profil utilisateur après connexion
      if (data.session) {
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
      
      return !!data.session;
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
