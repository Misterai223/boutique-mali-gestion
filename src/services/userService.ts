
import { supabase } from "@/integrations/supabase/client";
import { Profile, UserActivityLog } from "@/types/profile";
import { toast } from "sonner";

export const userService = {
  async getProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: false })
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Erreur lors du chargement des profils: ${error.message}`);
      return [];
    }
  },
  
  async getProfile(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error(`Erreur lors du chargement du profil: ${error.message}`);
      return null;
    }
  },
  
  async getCurrentUserProfile(): Promise<Profile | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error(`Erreur lors du chargement du profil: ${error.message}`);
      return null;
    }
  },
  
  async updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
    try {
      // Ajouter l'horodatage de mise à jour
      profile.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Enregistrer l'activité
      await this.logActivity(profile.id, 'update_profile', { changes: profile });
      
      toast.success('Profil mis à jour avec succès');
      return data;
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
      return null;
    }
  },
  
  async createUser(email: string, password: string, userData: Partial<Profile>): Promise<string | null> {
    try {
      // Créer l'utilisateur dans auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Confirmer l'email automatiquement
        user_metadata: {
          full_name: userData.full_name
        }
      });
      
      if (authError) throw authError;
      
      const userId = authData.user?.id;
      if (!userId) throw new Error("ID utilisateur non disponible");
      
      // Le profil sera créé automatiquement via le trigger, mais nous mettons à jour avec les données spécifiques
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: userData.role || 'user',
          access_level: userData.access_level || 1,
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      // Enregistrer l'activité
      const currentUser = await this.getCurrentUserProfile();
      if (currentUser) {
        await this.logActivity(currentUser.id, 'create_user', { 
          created_user_id: userId,
          email,
          role: userData.role
        });
      }
      
      toast.success('Utilisateur créé avec succès');
      return userId;
    } catch (error: any) {
      toast.error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
      return null;
    }
  },
  
  async deleteUser(id: string): Promise<boolean> {
    try {
      // Supprimer l'utilisateur de auth (en cascade dans profiles)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw error;
      
      // Enregistrer l'activité
      const currentUser = await this.getCurrentUserProfile();
      if (currentUser) {
        await this.logActivity(currentUser.id, 'delete_user', { deleted_user_id: id });
      }
      
      toast.success('Utilisateur supprimé avec succès');
      return true;
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
      return false;
    }
  },
  
  async uploadLogo(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      
      const { error, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);
      
      // Enregistrer l'activité
      const currentUser = await this.getCurrentUserProfile();
      if (currentUser) {
        await this.logActivity(currentUser.id, 'upload_logo', { 
          file_name: fileName,
          file_size: file.size
        });
      }
      
      return publicUrl;
    } catch (error: any) {
      toast.error(`Erreur lors du téléchargement du logo: ${error.message}`);
      return null;
    }
  },
  
  async logActivity(userId: string, activityType: string, details: Record<string, any> | null = null): Promise<void> {
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          activity_type: activityType,
          details
        });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'activité:", error);
    }
  },
  
  async getUserLogs(limit: number = 50): Promise<UserActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Erreur lors du chargement des logs: ${error.message}`);
      return [];
    }
  }
};
