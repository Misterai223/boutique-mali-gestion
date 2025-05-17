
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

    console.log("Utilisateur créé avec succès:", data);

    // Mettre à jour le profil avec les informations supplémentaires
    if (data?.user) {
      console.log("Mise à jour du profil pour l'utilisateur:", data.user.id);
      
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
      
      // Enregistrer l'activité
      await logUserActivity(
        data.user.id, // Ajouter l'ID de l'utilisateur qui effectue l'action
        'create_user',
        {
          created_user_id: data?.user?.id,
          created_user_email: email,
          role: userData.role,
          access_level: userData.access_level
        }
      );

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
    const { data, error } = await supabase
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
      throw error;
    }

    console.log("Profil mis à jour avec succès");

    // Si changement d'email ou mot de passe
    if (userData.email || userData.password) {
      const updateData: any = {};
      if (userData.email) updateData.email = userData.email;
      if (userData.password) updateData.password = userData.password;

      // Note: cette fonction nécessite des droits admin
      try {
        const authUpdateResult = await supabase.auth.admin.updateUserById(
          userId,
          updateData
        );
        
        if (authUpdateResult.error) {
          console.error("Erreur lors de la mise à jour des infos d'authentification:", authUpdateResult.error);
          throw authUpdateResult.error;
        }
      } catch (adminError) {
        console.error("Erreur d'accès admin pour la mise à jour:", adminError);
        // Fallback à la méthode non-admin si nécessaire
        if (userData.password) {
          console.log("Tentative de mise à jour du mot de passe via méthode standard");
          const { error: pwError } = await supabase.auth.updateUser({
            password: userData.password
          });
          
          if (pwError) {
            console.error("Échec de la mise à jour du mot de passe:", pwError);
          }
        }
      }
    }

    // Enregistrer l'activité
    const session = await supabase.auth.getSession();
    const currentUserId = session.data.session?.user.id;
    
    await logUserActivity(
      currentUserId || userId, // Utilisateur qui effectue l'action
      'update_user',
      {
        updated_user_id: userId,
        updated_fields: Object.keys(userData)
      }
    );

    return { data, error: null };
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return { data: null, error };
  }
};

// Fonction pour supprimer un utilisateur (admin seulement)
export const deleteUser = async (userId: string) => {
  try {
    console.log("Tentative de suppression de l'utilisateur:", userId);
    // Cette fonction nécessite des droits admin
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error("Erreur d'admin lors de la suppression de l'utilisateur:", error);
        throw error;
      }
    } catch (adminError) {
      console.error("Erreur d'accès admin pour la suppression:", adminError);
      // Fallback: supprimer directement le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error("Échec de la suppression du profil:", profileError);
        throw profileError;
      }
    }

    // Enregistrer l'activité
    const session = await supabase.auth.getSession();
    const currentUserId = session.data.session?.user.id;
    
    await logUserActivity(
      currentUserId || 'system',
      'delete_user',
      {
        deleted_user_id: userId
      }
    );

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
