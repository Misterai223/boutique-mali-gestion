
import { supabase } from "@/integrations/supabase/client";
import { UserActivityLog } from "@/types/user-activity";

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

// Fonction pour créer un nouvel utilisateur (admin seulement)
export const createUser = async (email: string, password: string, userData: any) => {
  try {
    // Créer un nouvel utilisateur dans auth.users
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName
      }
    });

    if (error) throw error;

    // Mettre à jour les informations supplémentaires dans le profil
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: userData.role || 'user',
          access_level: userData.accessLevel || 1
        })
        .eq('id', data.user.id);

      if (profileError) throw profileError;
    }

    // Enregistrer l'activité
    await logUserActivity(
      'create_user',
      {
        created_user_id: data?.user?.id,
        created_user_email: email,
        role: userData.role,
        access_level: userData.accessLevel
      }
    );

    return { data, error: null };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return { data: null, error };
  }
};

// Fonction pour mettre à jour un utilisateur (admin seulement)
export const updateUser = async (userId: string, userData: any) => {
  try {
    // Mettre à jour le profil utilisateur
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: userData.fullName,
        role: userData.role,
        access_level: userData.accessLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    // Si changement d'email ou mot de passe
    if (userData.email || userData.password) {
      const updateData: any = {};
      if (userData.email) updateData.email = userData.email;
      if (userData.password) updateData.password = userData.password;

      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        updateData
      );

      if (authError) throw authError;
    }

    // Enregistrer l'activité
    await logUserActivity(
      'update_user',
      {
        updated_user_id: userId,
        updated_fields: Object.keys(userData)
      }
    );

    return { data, error: null };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return { data: null, error };
  }
};

// Fonction pour supprimer un utilisateur (admin seulement)
export const deleteUser = async (userId: string) => {
  try {
    // Supprimer l'utilisateur (auth.users et profiles seront supprimés en cascade)
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw error;

    // Enregistrer l'activité
    await logUserActivity(
      'delete_user',
      {
        deleted_user_id: userId
      }
    );

    return { error: null };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return { error };
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

// Fonction pour vérifier si l'utilisateur actuel est administrateur
export const isUserAdmin = async () => {
  try {
    const { data, error } = await getCurrentUser();
    
    if (error) return false;
    return data?.role === 'admin';
  } catch (error) {
    return false;
  }
};

// Fonction pour enregistrer l'activité utilisateur
export const logUserActivity = async (activityType: string, details: Record<string, any> = {}) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;
    
    const userId = sessionData.session.user.id;
    
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        details
      });
      
    if (error) console.error("Erreur lors de l'enregistrement de l'activité:", error);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'activité:", error);
  }
};

// Fonction pour récupérer les journaux d'activité (admin seulement)
export const getUserActivityLogs = async () => {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { data: data as UserActivityLog[], error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des journaux d'activité:", error);
    return { data: null, error };
  }
};
