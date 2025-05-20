
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

// Fonction pour récupérer tous les profils utilisateurs
export const getProfiles = async (): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur dans getProfiles:", error);
      throw error;
    }
    
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

    if (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Exception lors de la mise à jour du profil:", error);
    return false;
  }
};

// Fonction pour obtenir le profil utilisateur courant
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("Aucune session active");
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return null;
    }
    
    // Si le profil n'existe pas mais que l'utilisateur est authentifié, le créer
    if (!data && sessionData.session) {
      const user = sessionData.session.user;
      
      // Créer un profil par défaut
      const newProfile: Partial<Profile> = {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Utilisateur',
        role: 'user',
        access_level: 1,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile as any);
        
      if (insertError) {
        console.error("Erreur lors de la création du profil:", insertError);
        return null;
      }
      
      return newProfile as Profile;
    }
    
    return data as Profile;
  } catch (error) {
    console.error("Exception lors de la récupération du profil utilisateur:", error);
    return null;
  }
};

// Fonction pour récupérer le profil utilisateur actuel avec gestion d'erreur
export const getCurrentUser = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      return { data: null, error: null };
    }
    
    const profile = await getCurrentUserProfile();
    return { data: profile, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return { data: null, error };
  }
};

// Fonction pour récupérer tous les utilisateurs (pour admin)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Exception lors de la récupération des utilisateurs:", error);
    return { data: null, error };
  }
};
