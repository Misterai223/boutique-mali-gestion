
export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxNumber?: string;
  logo?: string;
}

export interface InvoiceSettings {
  companyInfo: CompanyInfo;
  logoPosition: 'left' | 'center' | 'right';
  logoSize: 'small' | 'medium' | 'large';
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  includeHeader: boolean;
  includeFooter: boolean;
  headerText?: string;
  footerText?: string;
  currency: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
}

export interface InvoiceData extends ExportableTransaction {
  invoiceNumber?: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  dueDate?: string;
  notes?: string;
}

export interface ExportableTransaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}
