
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
  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error('Error fetching setting:', error);
      throw error;
    }

    return data.value as AppSettings[K];
  },

  async updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    const { error } = await supabase
      .from('app_settings')
      .update({ 
        value: value as any,
        updated_at: new Date().toISOString()
      })
      .eq('key', key);

    if (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },

  async getAllSettings(): Promise<AppSettings> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching all settings:', error);
      throw error;
    }

    const settings = {} as AppSettings;
    data?.forEach((item) => {
      (settings as any)[item.key] = item.value;
    });

    return settings;
  },

  // Logo management methods (placeholder implementations)
  async getLogos(): Promise<string[]> {
    // This would normally fetch from storage bucket
    // For now return empty array
    return [];
  },

  async uploadLogo(file: File): Promise<string> {
    // This would normally upload to storage bucket
    // For now return a placeholder URL
    console.log('Uploading logo:', file.name);
    return `https://placeholder.com/logo/${file.name}`;
  },

  async deleteLogoByUrl(url: string): Promise<boolean> {
    // This would normally delete from storage bucket
    console.log('Deleting logo:', url);
    return true;
  }
};
