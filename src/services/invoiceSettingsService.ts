
import { InvoiceSettings, CompanyInfo, InvoiceTheme } from "@/types/invoice";
import { toast } from "sonner";

const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: "Mon Commerce",
  address: "123 Rue de l'Entreprise, Dakar, Sénégal",
  phone: "+221 33 XXX XX XX",
  email: "contact@moncommerce.com",
  website: "www.moncommerce.com",
  taxNumber: "SN123456789"
};

const DEFAULT_THEME: InvoiceTheme = {
  templateStyle: 'premium',
  headerStyle: 'gradient',
  cardStyle: 'rounded',
  tableStyle: 'modern',
  shadowIntensity: 'medium',
  borderRadius: 6,
  spacing: 'normal'
};

const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  companyInfo: DEFAULT_COMPANY_INFO,
  logoPosition: 'left',
  logoSize: 'medium',
  pageSize: 'A4',
  orientation: 'portrait',
  primaryColor: '#2980b9',
  accentColor: '#3498db',
  secondaryColor: '#95a5a6',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontSize: 'medium',
  fontFamily: 'helvetica',
  includeHeader: true,
  includeFooter: true,
  headerText: "Facture",
  footerText: "Merci pour votre confiance",
  currency: "F CFA",
  dateFormat: 'DD/MM/YYYY',
  theme: DEFAULT_THEME,
  watermark: {
    enabled: false,
    text: '',
    opacity: 0.1
  }
};

export const invoiceSettingsService = {
  getSettings(): InvoiceSettings {
    try {
      const stored = localStorage.getItem('invoiceSettings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Fusionner avec les paramètres par défaut pour gérer les nouveaux champs
        return { 
          ...DEFAULT_INVOICE_SETTINGS, 
          ...parsed,
          theme: { ...DEFAULT_THEME, ...parsed.theme },
          companyInfo: { ...DEFAULT_COMPANY_INFO, ...parsed.companyInfo },
          watermark: { ...DEFAULT_INVOICE_SETTINGS.watermark, ...parsed.watermark }
        };
      }
      return DEFAULT_INVOICE_SETTINGS;
    } catch (error) {
      console.error('Error loading invoice settings:', error);
      return DEFAULT_INVOICE_SETTINGS;
    }
  },

  saveSettings(settings: InvoiceSettings): void {
    try {
      localStorage.setItem('invoiceSettings', JSON.stringify(settings));
      toast.success("Paramètres de facture sauvegardés avec succès");
    } catch (error) {
      console.error('Error saving invoice settings:', error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    }
  },

  updateCompanyInfo(companyInfo: CompanyInfo): void {
    const settings = this.getSettings();
    settings.companyInfo = companyInfo;
    this.saveSettings(settings);
  },

  updateLogo(logoUrl: string): void {
    const settings = this.getSettings();
    settings.companyInfo.logo = logoUrl;
    this.saveSettings(settings);
  },

  updateTheme(theme: Partial<InvoiceTheme>): void {
    const settings = this.getSettings();
    settings.theme = { ...settings.theme, ...theme };
    this.saveSettings(settings);
  },

  resetToDefaults(): InvoiceSettings {
    this.saveSettings(DEFAULT_INVOICE_SETTINGS);
    return DEFAULT_INVOICE_SETTINGS;
  }
};
