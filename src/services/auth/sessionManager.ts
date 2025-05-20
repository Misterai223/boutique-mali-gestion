
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
      return null;
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
    
    if (error) {
      console.error("Erreur de récupération d'utilisateur:", error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error("Erreur de récupération d'utilisateur:", error);
    return null;
  }
}

// Check if MFA is required for a user
export async function checkMfaFactors(): Promise<{isMfaEnabled: boolean, factors: any[]}> {
  // Pour simplifier, nous désactivons MFA pour l'instant
  return { isMfaEnabled: false, factors: [] };
}

// Subscribe to auth changes
export function subscribeToAuthChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    // Utiliser un timeout pour éviter les problèmes de deadlock
    setTimeout(() => {
      callback(event, session);
    }, 0);
  });
}
