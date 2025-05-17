
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

// Fonction pour récupérer tous les profils utilisateurs
export const getProfiles = async (): Promise<Profile[]> => {
  try {
    console.log("Chargement des profils...");
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error("Erreur dans getProfiles:", error);
      throw error;
    }
    
    console.log(`${data?.length || 0} profils chargés`);
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    return [];
  }
};

// Fonction pour mettre à jour un profil utilisateur
export const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
  try {
    console.log("Mise à jour du profil:", profileData.id);
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
    
    console.log("Profil mis à jour avec succès");
    return true;
  } catch (error) {
    console.error("Exception lors de la mise à jour du profil:", error);
    return false;
  }
};

// Fonction pour obtenir le profil utilisateur courant
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  try {
    console.log("Récupération du profil utilisateur courant");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log("Aucune session active");
      return null;
    }
    
    console.log("Session active pour l'utilisateur:", sessionData.session.user.id);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      
      // Si le profil n'existe pas encore, nous allons le créer automatiquement
      if (error.code === 'PGRST116') {
        console.log("Profil non trouvé, création automatique...");
        const newProfile: Partial<Profile> = {
          id: sessionData.session.user.id,
          role: 'admin', // Par défaut, les utilisateurs authentifiés sont administrateurs
          access_level: 5,
          full_name: sessionData.session.user.email?.split('@')[0] || 'Utilisateur'
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);
          
        if (insertError) {
          console.error("Erreur lors de la création du profil:", insertError);
          return null;
        }
        
        return {
          ...newProfile, 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: null
        } as Profile;
      }
      
      throw error;
    }
    
    console.log("Profil récupéré:", data);
    return data;
  } catch (error) {
    console.error("Exception lors de la récupération du profil utilisateur:", error);
    return null;
  }
};

// Fonction pour récupérer tous les utilisateurs (pour admin)
export const getAllUsers = async () => {
  try {
    console.log("Récupération de tous les utilisateurs");
    // Récupérer les utilisateurs depuis leur profil
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
    
    console.log(`${data?.length || 0} utilisateurs récupérés`);
    return { data, error: null };
  } catch (error) {
    console.error("Exception lors de la récupération des utilisateurs:", error);
    return { data: null, error };
  }
};

// Fonction pour récupérer le profil utilisateur actuel
export const getCurrentUser = async () => {
  try {
    console.log("Récupération de l'utilisateur actuel");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erreur de session:", sessionError);
      throw sessionError;
    }
    
    if (!sessionData.session) {
      console.log("Aucune session active");
      return { data: null, error: new Error("Non authentifié") };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .maybeSingle(); // Utiliser maybeSingle au lieu de single
      
    if (error) {
      console.error("Erreur de récupération du profil:", error);
      throw error;
    }
    
    console.log("Utilisateur récupéré:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Exception lors de la récupération du profil utilisateur:", error);
    return { data: null, error };
  }
};
