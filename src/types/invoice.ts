
export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxNumber?: string;
  logo?: string;
}

export interface InvoiceTheme {
  templateStyle: 'modern' | 'classic' | 'minimal' | 'premium';
  headerStyle: 'gradient' | 'solid' | 'minimal';
  cardStyle: 'rounded' | 'sharp' | 'elevated';
  tableStyle: 'striped' | 'bordered' | 'minimal' | 'modern';
  shadowIntensity: 'none' | 'light' | 'medium' | 'strong';
  borderRadius: number;
  spacing: 'compact' | 'normal' | 'spacious';
}

export interface InvoiceSettings {
  companyInfo: CompanyInfo;
  logoPosition: 'left' | 'center' | 'right';
  logoSize: 'small' | 'medium' | 'large';
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  primaryColor: string;
  accentColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'helvetica' | 'times' | 'courier';
  includeHeader: boolean;
  includeFooter: boolean;
  headerText?: string;
  footerText?: string;
  currency: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  theme: InvoiceTheme;
  watermark?: {
    enabled: boolean;
    text?: string;
    opacity?: number;
  };
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
