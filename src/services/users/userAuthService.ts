import { supabase } from "@/integrations/supabase/client";
import { logUserActivity } from "./userActivityService";

// Fonction pour créer un nouvel utilisateur (admin seulement)
export const createUser = async (email: string, password: string, userData: any) => {
  try {
    console.log("Tentative de création d'un utilisateur:", email, userData);
    
    // Création d'un utilisateur via l'API publique
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name
        }
      }
    });

    if (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      return { data: null, error };
    }

    console.log("Utilisateur créé:", data.user);

    // Mettre à jour le profil avec les informations supplémentaires
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: userData.full_name,
          role: userData.role || 'user',
          access_level: userData.access_level || 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Erreur lors de la mise à jour du profil:", profileError);
        return { data: null, error: profileError };
      }
      
      console.log("Profil mis à jour avec succès");
    }

    // Enregistrer l'activité
    await logUserActivity(
      'create_user',
      {
        created_user_id: data?.user?.id,
        created_user_email: email,
        role: userData.role,
        access_level: userData.access_level
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

// Fonction pour vérifier si l'utilisateur actuel est administrateur
export const isUserAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', (await supabase.auth.getSession()).data.session?.user.id || '')
      .single();
    
    if (error) return false;
    return data?.role === 'admin';
  } catch (error) {
    return false;
  }
};
