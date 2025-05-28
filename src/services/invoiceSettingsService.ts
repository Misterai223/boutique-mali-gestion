
import { InvoiceSettings, CompanyInfo } from "@/types/invoice";
import { toast } from "sonner";

const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: "Mon Commerce",
  address: "123 Rue de l'Entreprise, Dakar, Sénégal",
  phone: "+221 33 XXX XX XX",
  email: "contact@moncommerce.com",
  website: "www.moncommerce.com",
  taxNumber: "SN123456789"
};

const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  companyInfo: DEFAULT_COMPANY_INFO,
  logoPosition: 'left',
  logoSize: 'medium',
  pageSize: 'A4',
  orientation: 'portrait',
  primaryColor: '#2980b9',
  accentColor: '#3498db',
  fontSize: 'medium',
  includeHeader: true,
  includeFooter: true,
  headerText: "Facture",
  footerText: "Merci pour votre confiance",
  currency: "F CFA",
  dateFormat: 'DD/MM/YYYY'
};

export const invoiceSettingsService = {
  getSettings(): InvoiceSettings {
    try {
      const stored = localStorage.getItem('invoiceSettings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_INVOICE_SETTINGS, ...parsed };
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
      toast.success("Paramètres de facture sauvegardés");
    } catch (error) {
      console.error('Error saving invoice settings:', error);
      toast.error("Erreur lors de la sauvegarde");
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
  }
};
