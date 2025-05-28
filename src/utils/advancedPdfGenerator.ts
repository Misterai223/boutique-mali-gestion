
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InvoiceSettings, InvoiceData } from '@/types/invoice';

export class AdvancedPdfGenerator {
  private doc: jsPDF;
  private settings: InvoiceSettings;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor(settings: InvoiceSettings) {
    this.settings = settings;
    this.doc = new jsPDF({
      orientation: settings.orientation || 'portrait',
      unit: 'mm',
      format: settings.pageSize.toLowerCase() as 'a4' | 'letter'
    });
    
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private getFontSize(): number {
    const sizeMap = {
      small: 10,
      medium: 12,
      large: 14
    };
    return sizeMap[this.settings.fontSize] || 12;
  }

  private addHeader(): number {
    let yPosition = this.margin;

    // Couleur principale pour l'en-tête
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');

    // Logo de l'entreprise
    if (this.settings.companyInfo.logo) {
      try {
        const logoSize = this.settings.logoSize === 'small' ? 20 : this.settings.logoSize === 'large' ? 40 : 30;
        let logoX = this.margin;
        
        if (this.settings.logoPosition === 'center') {
          logoX = (this.pageWidth - logoSize) / 2;
        } else if (this.settings.logoPosition === 'right') {
          logoX = this.pageWidth - this.margin - logoSize;
        }
        
        this.doc.addImage(this.settings.companyInfo.logo, 'PNG', logoX, yPosition, logoSize, logoSize * 0.6);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }
    }

    // Nom de l'entreprise
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.getFontSize() + 6);
    this.doc.setFont('helvetica', 'bold');
    const companyNameX = this.settings.logoPosition === 'left' && this.settings.companyInfo.logo ? this.margin + 35 : this.margin;
    this.doc.text(this.settings.companyInfo.name, companyNameX, yPosition + 15);

    yPosition += 50;

    // Informations de l'entreprise
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize() - 1);
    this.doc.setFont('helvetica', 'normal');
    
    const companyInfo = [
      this.settings.companyInfo.address,
      this.settings.companyInfo.phone,
      this.settings.companyInfo.email,
      this.settings.companyInfo.website
    ].filter(info => info);

    companyInfo.forEach((info, index) => {
      this.doc.text(info, this.margin, yPosition + (index * 6));
    });

    return yPosition + (companyInfo.length * 6) + 10;
  }

  private addInvoiceInfo(data: any, yPosition: number): number {
    // Titre
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setFontSize(this.getFontSize() + 8);
    this.doc.setFont('helvetica', 'bold');
    const headerText = this.settings.headerText || 'RAPPORT';
    this.doc.text(headerText, this.pageWidth - this.margin - 60, yPosition);

    // Date et informations
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize());
    this.doc.setFont('helvetica', 'normal');

    const currentDate = new Date().toLocaleDateString('fr-FR');
    this.doc.text(`Date: ${currentDate}`, this.pageWidth - this.margin - 60, yPosition + 15);

    return yPosition + 35;
  }

  private addTransactionsTable(transactions: any[], yPosition: number): number {
    const tableHeaders = ['Description', 'Type', 'Montant', 'Date', 'Catégorie'];
    const tableData = transactions.map(transaction => [
      transaction.description,
      transaction.type === 'income' ? 'Recette' : 'Dépense',
      `${transaction.amount.toFixed(2)} ${this.settings.currency}`,
      new Date(transaction.date).toLocaleDateString('fr-FR'),
      transaction.category
    ]);

    const primaryRgb = this.hexToRgb(this.settings.primaryColor);

    autoTable(this.doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      headStyles: {
        fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b],
        textColor: [255, 255, 255],
        fontSize: this.getFontSize(),
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: this.getFontSize() - 1,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' }
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto'
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addTotals(transactions: any[], yPosition: number): number {
    const totalsX = this.pageWidth - this.margin - 80;
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const total = income - expenses;

    this.doc.setFontSize(this.getFontSize());
    this.doc.setFont('helvetica', 'normal');
    
    // Recettes
    this.doc.text('Recettes:', totalsX, yPosition);
    this.doc.text(`${income.toFixed(2)} ${this.settings.currency}`, totalsX + 40, yPosition);

    // Dépenses
    yPosition += 8;
    this.doc.text('Dépenses:', totalsX, yPosition);
    this.doc.text(`${expenses.toFixed(2)} ${this.settings.currency}`, totalsX + 40, yPosition);

    // Total
    yPosition += 12;
    this.doc.setFontSize(this.getFontSize() + 2);
    this.doc.setFont('helvetica', 'bold');
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.text('SOLDE:', totalsX, yPosition);
    this.doc.text(`${total.toFixed(2)} ${this.settings.currency}`, totalsX + 40, yPosition);

    return yPosition + 15;
  }

  private addFooter(): void {
    if (!this.settings.includeFooter) return;

    const footerY = this.pageHeight - 20;
    this.doc.setFontSize(this.getFontSize() - 2);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(128, 128, 128);
    
    const footerText = this.settings.footerText || 'Merci pour votre confiance';
    this.doc.text(footerText, this.pageWidth / 2, footerY, { align: 'center' });
  }

  public generateInvoice(data: any[], title?: string): jsPDF {
    let currentY = this.addHeader();
    currentY = this.addInvoiceInfo(data, currentY);
    currentY = this.addTransactionsTable(data, currentY);
    currentY = this.addTotals(data, currentY);
    
    this.addFooter();

    return this.doc;
  }

  public previewPDF(): string {
    return this.doc.output('datauristring');
  }

  public downloadPDF(filename: string = 'rapport.pdf'): void {
    this.doc.save(filename);
  }

  public printPDF(): void {
    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      pdfWindow.document.write(`
        <html>
          <head><title>Impression</title></head>
          <body>
            <iframe src="${this.doc.output('datauristring')}" 
                    style="width:100%;height:100%;border:none;" 
                    onload="window.print()">
            </iframe>
          </body>
        </html>
      `);
    }
  }
}

// Fonction utilitaire pour créer des paramètres par défaut
export const createDefaultSettings = (overrides: Partial<InvoiceSettings> = {}): InvoiceSettings => ({
  companyInfo: {
    name: "Mon Commerce",
    address: "123 Rue de l'Entreprise, Dakar, Sénégal",
    phone: "+221 33 XXX XX XX",
    email: "contact@moncommerce.com",
    website: "www.moncommerce.com",
    taxNumber: "SN123456789",
    ...overrides.companyInfo
  },
  logoPosition: 'left',
  logoSize: 'medium',
  pageSize: 'A4',
  orientation: 'portrait',
  primaryColor: '#2980b9',
  accentColor: '#3498db',
  fontSize: 'medium',
  includeHeader: true,
  includeFooter: true,
  headerText: "Rapport",
  footerText: "Merci pour votre confiance",
  currency: "F CFA",
  dateFormat: 'DD/MM/YYYY',
  ...overrides
});
