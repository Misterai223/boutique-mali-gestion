
import { supabase } from "@/integrations/supabase/client";
import { logUserActivity } from "./userActivityService";

// Fonction pour créer un nouvel utilisateur (admin seulement)
export const createUser = async (email: string, password: string, userData: any) => {
  try {
    console.log("Tentative de création d'un utilisateur:", email, userData);
    
    // Assurer que le niveau d'accès est correct en fonction du rôle
    const access_level = userData.role === 'admin' ? 5 : 1;
    
    // Création d'un utilisateur via l'API publique
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role || 'employee',
          access_level: access_level,
          created_by_admin: true // Marquer que cet utilisateur a été créé par un admin
        }
      }
    });

    if (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      return { data: null, error };
    }

    console.log("Utilisateur créé avec succès:", data);

    // Pour accélérer le processus sans attendre la création automatique par le trigger
    // Créer manuellement le profil utilisateur dans la table profiles
    if (data?.user) {
      console.log("Création manuelle du profil pour l'utilisateur ID:", data.user.id);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: userData.full_name,
          role: userData.role || 'employee',
          access_level: access_level,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by_admin: true // Marquer aussi dans la table profiles
        });
        
      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        // Ne pas bloquer le processus, le trigger handle_new_user devrait le créer automatiquement
      }
      
      // Enregistrer l'activité
      try {
        const session = await supabase.auth.getSession();
        const currentUserId = session.data.session?.user.id || 'system';
        
        await logUserActivity(
          currentUserId,
          'create_user',
          {
            created_user_id: data.user.id,
            created_user_email: email,
            role: userData.role,
            access_level: access_level
          }
        );
      } catch (activityError) {
        console.error("Erreur lors de l'enregistrement de l'activité:", activityError);
      }

      return { data, error: null };
    } else {
      console.error("L'utilisateur a été créé mais data.user est null");
      return { data: null, error: new Error("L'utilisateur a été créé mais data.user est null") };
    }
  } catch (error) {
    console.error("Exception lors de la création de l'utilisateur:", error);
    return { data: null, error };
  }
};

// Fonction pour mettre à jour un utilisateur (admin seulement)
export const updateUser = async (userId: string, userData: any) => {
  try {
    console.log("Tentative de mise à jour de l'utilisateur:", userId, userData);
    
    // Mettre à jour le profil utilisateur
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: userData.full_name,
        role: userData.role,
        access_level: userData.access_level,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return { data: null, error };
    }

    console.log("Profil mis à jour avec succès");

    // Si changement d'email ou mot de passe
    if (userData.email || userData.password) {
      const updateData: any = {};
      if (userData.email) updateData.email = userData.email;
      if (userData.password) updateData.password = userData.password;

      try {
        const { error: authError } = await supabase.auth.updateUser(updateData);
        
        if (authError) {
          console.error("Erreur lors de la mise à jour des infos d'authentification:", authError);
          return { data: null, error: authError };
        }
      } catch (authError) {
        console.error("Erreur lors de la mise à jour des infos d'authentification:", authError);
        return { data: null, error: authError };
      }
    }

    // Enregistrer l'activité
    try {
      const session = await supabase.auth.getSession();
      const currentUserId = session.data.session?.user.id || 'system';
      
      await logUserActivity(
        currentUserId,
        'update_user',
        {
          updated_user_id: userId,
          updated_fields: Object.keys(userData)
        }
      );
    } catch (activityError) {
      console.error("Erreur lors de l'enregistrement de l'activité:", activityError);
      // Ne pas bloquer la mise à jour si l'enregistrement d'activité échoue
    }

    return { data: { success: true }, error: null };
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return { data: null, error };
  }
};

// Fonction pour supprimer un utilisateur (admin seulement)
export const deleteUser = async (userId: string) => {
  try {
    console.log("Tentative de suppression de l'utilisateur:", userId);
    
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      return { error };
    }

    // Enregistrer l'activité
    try {
      const session = await supabase.auth.getSession();
      const currentUserId = session.data.session?.user.id || 'system';
      
      await logUserActivity(
        currentUserId,
        'delete_user',
        {
          deleted_user_id: userId
        }
      );
    } catch (activityError) {
      console.error("Erreur lors de l'enregistrement de l'activité:", activityError);
      // Ne pas bloquer la suppression si l'enregistrement d'activité échoue
    }

    return { error: null };
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return { error };
  }
};

// Fonction pour vérifier si l'utilisateur actuel est administrateur
export const isUserAdmin = async () => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la vérification du rôle admin:", error);
      return false;
    }
    
    return data?.role === 'admin';
  } catch (error) {
    console.error("Exception lors de la vérification du rôle admin:", error);
    return false;
  }
};
