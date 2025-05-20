
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
      return [];
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
      return false;
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
    const session = await supabase.auth.getSession();
    
    if (!session.data.session) {
      console.log("Aucune session active");
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.data.session.user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return null;
    }
    
    if (!data) {
      console.log("Aucun profil trouvé");
      return null;
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
      return { data: [], error: null };
    }
    
    console.log(`${data?.length || 0} utilisateurs récupérés`);
    return { data, error: null };
  } catch (error) {
    console.error("Exception lors de la récupération des utilisateurs:", error);
    return { data: [], error };
  }
};

// Fonction pour récupérer le profil utilisateur actuel
export const getCurrentUser = async () => {
  try {
    console.log("Récupération de l'utilisateur actuel");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erreur de session:", sessionError);
      return { data: null, error: sessionError };
    }
    
    if (!sessionData.session) {
      console.log("Aucune session active");
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur de récupération du profil:", error);
      return { data: null, error };
    }
    
    console.log("Utilisateur récupéré:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Exception lors de la récupération du profil utilisateur:", error);
    return { data: null, error };
  }
};
