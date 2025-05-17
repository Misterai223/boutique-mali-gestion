
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";

/**
 * Functions related to session management and user state
 */

// Get current session
export async function getSession(): Promise<Session | null> {
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
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    // Get user role if not already in localStorage
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
}

// Subscribe to auth changes
export function subscribeToAuthChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
