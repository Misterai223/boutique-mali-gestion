
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Functions related to account management
 */

// User logout
export async function logout(): Promise<void> {
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
}

// Update user password
export async function updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    // Verify current password
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user || !userData.user.email) {
      toast.error("Aucun utilisateur connecté");
      return false;
    }
    
    // Attempt to sign in with current password for verification
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword
    });
    
    if (signInError) {
      toast.error("Mot de passe actuel incorrect");
      return false;
    }
    
    // Update the password
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
