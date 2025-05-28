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

  private addCompanyHeader(): number {
    let yPosition = this.margin;

    // Bande colorée en haut
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.rect(0, 0, this.pageWidth, 35, 'F');

    // Logo de l'entreprise (si disponible)
    if (this.settings.companyInfo.logo) {
      try {
        const logoSize = this.settings.logoSize === 'small' ? 25 : this.settings.logoSize === 'large' ? 35 : 30;
        this.doc.addImage(this.settings.companyInfo.logo, 'PNG', this.margin, yPosition, logoSize, logoSize * 0.7);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }
    }

    // Nom de l'entreprise en blanc sur la bande colorée
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    const companyNameX = this.settings.companyInfo.logo ? this.margin + 40 : this.margin;
    this.doc.text(this.settings.companyInfo.name, companyNameX, yPosition + 20);

    yPosition += 50;

    // Informations de l'entreprise dans un cadre à gauche
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize());
    this.doc.setFont('helvetica', 'bold');
    this.doc.text("INFORMATIONS ENTREPRISE", this.margin, yPosition);
    
    // Cadre pour les informations de l'entreprise
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, yPosition + 5, 80, 45);

    yPosition += 15;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(this.getFontSize() - 1);
    
    const companyInfo = [
      this.settings.companyInfo.address,
      `Tél: ${this.settings.companyInfo.phone}`,
      `Email: ${this.settings.companyInfo.email}`,
      this.settings.companyInfo.website ? `Web: ${this.settings.companyInfo.website}` : '',
      this.settings.companyInfo.taxNumber ? `N° Fiscal: ${this.settings.companyInfo.taxNumber}` : ''
    ].filter(info => info);

    companyInfo.forEach((info, index) => {
      this.doc.text(info, this.margin + 3, yPosition + (index * 6));
    });

    return yPosition + (companyInfo.length * 6) + 15;
  }

  private addInvoiceHeader(clientData: any, yPosition: number): number {
    // Titre FACTURE à droite
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text("FACTURE", this.pageWidth - this.margin - 50, yPosition - 25);

    // Numéro de facture et date
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize());
    this.doc.setFont('helvetica', 'normal');
    
    const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    this.doc.text(`N° Facture: ${invoiceNumber}`, this.pageWidth - this.margin - 80, yPosition - 10);
    this.doc.text(`Date: ${currentDate}`, this.pageWidth - this.margin - 80, yPosition - 2);

    return yPosition;
  }

  private addClientInfo(clientData: any, yPosition: number): number {
    // Informations client dans un cadre à droite
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(this.getFontSize());
    this.doc.text("FACTURÉ À", this.pageWidth - this.margin - 80, yPosition);

    // Cadre pour les informations client
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.pageWidth - this.margin - 80, yPosition + 5, 75, 40);

    yPosition += 15;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(this.getFontSize() - 1);

    const clientInfo = [
      clientData.fullName || 'Client',
      clientData.phoneNumber || '',
      clientData.email || '',
      clientData.address || ''
    ].filter(info => info);

    clientInfo.forEach((info, index) => {
      // Limiter la longueur du texte pour éviter le débordement
      const maxWidth = 70;
      const text = this.doc.splitTextToSize(info, maxWidth);
      this.doc.text(text, this.pageWidth - this.margin - 77, yPosition + (index * 7));
    });

    return yPosition + Math.max(clientInfo.length * 7, 40) + 15;
  }

  private addProductsTable(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.text("Aucun produit acheté", this.margin, yPosition);
      return yPosition + 10;
    }

    const tableHeaders = ['Description', 'Quantité', 'Prix unitaire', 'Total'];
    const tableData = clientData.purchases.map((purchase: any) => [
      purchase.product.name,
      purchase.quantity.toString(),
      `${purchase.product.price.toLocaleString()} ${this.settings.currency}`,
      `${(purchase.quantity * purchase.product.price).toLocaleString()} ${this.settings.currency}`
    ]);

    const primaryRgb = this.hexToRgb(this.settings.primaryColor);

    autoTable(this.doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      theme: 'striped',
      headStyles: {
        fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b],
        textColor: [255, 255, 255],
        fontSize: this.getFontSize(),
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: this.getFontSize() - 1,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto',
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      }
    });

    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addTotalSection(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      return yPosition;
    }

    const total = clientData.purchases.reduce((sum: number, purchase: any) => {
      return sum + (purchase.quantity * purchase.product.price);
    }, 0);

    // Cadre pour le total
    const totalBoxWidth = 60;
    const totalBoxHeight = 25;
    const totalBoxX = this.pageWidth - this.margin - totalBoxWidth;

    this.doc.setDrawColor(100, 100, 100);
    this.doc.setLineWidth(1);
    this.doc.rect(totalBoxX, yPosition, totalBoxWidth, totalBoxHeight);

    // Fond coloré pour le total
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b, 0.1);
    this.doc.rect(totalBoxX, yPosition, totalBoxWidth, totalBoxHeight, 'F');

    // Texte du total
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(this.getFontSize() + 2);
    this.doc.text('TOTAL À PAYER', totalBoxX + 5, yPosition + 10);
    
    this.doc.setFontSize(this.getFontSize() + 4);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.text(`${total.toLocaleString()} ${this.settings.currency}`, totalBoxX + 5, yPosition + 20);

    return yPosition + totalBoxHeight + 20;
  }

  private addFooter(): void {
    if (!this.settings.includeFooter) return;

    const footerY = this.pageHeight - 25;
    
    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);

    // Texte du pied de page
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(this.getFontSize() - 2);
    
    const footerText = this.settings.footerText || 'Merci pour votre confiance';
    this.doc.text(footerText, this.pageWidth / 2, footerY, { align: 'center' });

    // Numéro de page
    this.doc.text('Page 1', this.pageWidth - this.margin, footerY, { align: 'right' });
  }

  public generateClientInvoice(clientData: any): jsPDF {
    let currentY = this.addCompanyHeader();
    currentY = this.addInvoiceHeader(clientData, currentY);
    currentY = this.addClientInfo(clientData, currentY);
    currentY = this.addProductsTable(clientData, currentY);
    currentY = this.addTotalSection(clientData, currentY);
    
    this.addFooter();

    return this.doc;
  }

  // Méthode pour les rapports généraux (transactions)
  public generateInvoice(data: any[]): jsPDF {
    let currentY = this.margin;

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
        
        this.doc.addImage(this.settings.companyInfo.logo, 'PNG', logoX, currentY, logoSize, logoSize * 0.6);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }
    }

    // Nom de l'entreprise
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.getFontSize() + 6);
    this.doc.setFont('helvetica', 'bold');
    const companyNameX = this.settings.logoPosition === 'left' && this.settings.companyInfo.logo ? this.margin + 35 : this.margin;
    this.doc.text(this.settings.companyInfo.name, companyNameX, currentY + 15);

    currentY += 50;

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
      this.doc.text(info, this.margin, currentY + (index * 6));
    });
    
    // Titre du rapport
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setFontSize(this.getFontSize() + 8);
    this.doc.setFont('helvetica', 'bold');
    const headerText = this.settings.headerText || 'RAPPORT';
    this.doc.text(headerText, this.pageWidth - this.margin - 60, currentY);

    currentY += 20;

    // Tableau des transactions
    const tableHeaders = ['Description', 'Type', 'Montant', 'Date', 'Catégorie'];
    const tableData = data.map(transaction => [
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
      startY: currentY,
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
      margin: { left: this.margin, right: this.margin }
    });

    this.addFooter();
    return this.doc;
  }

  public previewPDF(): string {
    return this.doc.output('datauristring');
  }

  public downloadPDF(filename: string = 'facture.pdf'): void {
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
