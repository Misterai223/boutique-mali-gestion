
import { supabase } from "@/integrations/supabase/client";

export interface AppSettings {
  company_info: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  invoice_settings: {
    prefix: string;
    next_number: number;
    tax_rate: number;
    currency: string;
  };
  theme_settings: {
    primary_color: string;
    logo_url: string | null;
  };
}

export const settingsService = {
  // Récupérer un paramètre par clé
  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K] | null> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du paramètre ${key}:`, error);
      return null;
    }

    return data?.value as AppSettings[K];
  },

  // Mettre à jour un paramètre
  async updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: value as any })
      .eq('key', key);

    if (error) {
      console.error(`Erreur lors de la mise à jour du paramètre ${key}:`, error);
      throw error;
    }
  },

  // Récupérer tous les paramètres
  async getAllSettings(): Promise<Partial<AppSettings>> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value');

    if (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      throw error;
    }

    const settings: any = {};
    data?.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    return settings;
  }
};
