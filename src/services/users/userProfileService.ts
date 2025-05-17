import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

// Fonction pour récupérer tous les profils utilisateurs
export const getProfiles = async (): Promise<Profile[]> => {
  try {
    console.log("Chargement des profils...");
    // Ajout de limit pour éviter les problèmes de profondeur de pile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Limitation pour éviter l'erreur "stack depth limit exceeded"

    if (error) {
      console.error("Erreur dans getProfiles:", error);
      throw error;
    }
    
    console.log("Profils chargés:", data);
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    return [];
  }
};

// Fonction pour mettre à jour un profil utilisateur
export const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileData.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return false;
  }
};

// Fonction pour obtenir le profil utilisateur courant
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur:", error);
    return null;
  }
};

// Fonction pour récupérer tous les utilisateurs (pour admin)
export const getAllUsers = async () => {
  try {
    // Récupérer les utilisateurs depuis auth.users via leur profil
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return { data: null, error };
  }
};

// Fonction pour récupérer le profil utilisateur actuel
export const getCurrentUser = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) return { data: null, error: new Error("Non authentifié") };
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur:", error);
    return { data: null, error };
  }
};
