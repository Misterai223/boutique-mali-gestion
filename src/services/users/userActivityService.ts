
import { supabase } from "@/integrations/supabase/client";
import { UserActivityLog } from "@/types/user-activity";

// Fonction pour enregistrer l'activité utilisateur
export const logUserActivity = async (userId: string, activityType: string, details: Record<string, any> = {}) => {
  try {
    console.log(`Enregistrement de l'activité ${activityType} pour l'utilisateur ${userId}`);
    
    // Vérifier que userId est défini
    if (!userId || userId === 'undefined') {
      console.error("ID utilisateur non défini lors de l'enregistrement de l'activité");
      const session = await supabase.auth.getSession();
      userId = session.data.session?.user.id || 'system';
    }
    
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        details
      });
      
    if (error) {
      console.error("Erreur lors de l'enregistrement de l'activité:", error);
    } else {
      console.log("Activité enregistrée avec succès");
    }
  } catch (error) {
    console.error("Exception lors de l'enregistrement de l'activité:", error);
  }
};

// Fonction pour récupérer les journaux d'activité (admin seulement)
export const getUserActivityLogs = async () => {
  try {
    console.log("Récupération des journaux d'activité");
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Limitation pour éviter l'erreur "stack depth limit exceeded"
      
    if (error) {
      console.error("Erreur lors de la récupération des journaux d'activité:", error);
      throw error;
    }
    
    console.log(`${data?.length || 0} journaux d'activité récupérés`);
    return { data: data as UserActivityLog[], error: null };
  } catch (error) {
    console.error("Exception lors de la récupération des journaux d'activité:", error);
    return { data: null, error };
  }
};
