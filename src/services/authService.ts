
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const authService = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
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
      
      return data.user;
    } catch (error) {
      console.error("Erreur de récupération d'utilisateur:", error);
      return null;
    }
  },
  
  async updatePassword(newPassword: string): Promise<boolean> {
    try {
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
