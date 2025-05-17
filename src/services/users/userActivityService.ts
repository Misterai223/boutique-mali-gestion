
import { supabase } from "@/integrations/supabase/client";
import { UserActivityLog } from "@/types/user-activity";

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
