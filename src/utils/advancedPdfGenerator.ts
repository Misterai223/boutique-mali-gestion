
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  fontSize: number;
  pageFormat: 'A4' | 'Letter';
  showLogo: boolean;
  includeFooter: boolean;
  footerText: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  clientName: string;
  clientAddress?: string;
  clientEmail?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
}

export class AdvancedPdfGenerator {
  private doc: jsPDF;
  private settings: InvoiceSettings;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor(settings: InvoiceSettings) {
    this.settings = settings;
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: settings.pageFormat.toLowerCase() as 'a4' | 'letter'
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

  private addHeader(): number {
    let yPosition = this.margin;

    // Couleur principale pour l'en-tête
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');

    // Logo de l'entreprise
    if (this.settings.showLogo && this.settings.logoUrl) {
      try {
        this.doc.addImage(this.settings.logoUrl, 'PNG', this.margin, yPosition, 30, 20);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }
    }

    // Nom de l'entreprise
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.settings.fontSize + 6);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.settings.companyName, this.settings.showLogo ? this.margin + 35 : this.margin, yPosition + 15);

    yPosition += 50;

    // Informations de l'entreprise
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.settings.fontSize - 1);
    this.doc.setFont('helvetica', 'normal');
    
    const companyInfo = [
      this.settings.companyAddress,
      this.settings.companyPhone,
      this.settings.companyEmail
    ].filter(info => info);

    companyInfo.forEach((info, index) => {
      this.doc.text(info, this.margin, yPosition + (index * 6));
    });

    return yPosition + (companyInfo.length * 6) + 10;
  }

  private addInvoiceInfo(data: InvoiceData, yPosition: number): number {
    // Titre Facture
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setFontSize(this.settings.fontSize + 8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FACTURE', this.pageWidth - this.margin - 40, yPosition);

    // Numéro de facture et dates
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.settings.fontSize);
    this.doc.setFont('helvetica', 'normal');

    const invoiceDetails = [
      `N° ${data.invoiceNumber}`,
      `Date: ${data.date}`,
      data.dueDate ? `Échéance: ${data.dueDate}` : ''
    ].filter(detail => detail);

    invoiceDetails.forEach((detail, index) => {
      this.doc.text(detail, this.pageWidth - this.margin - 60, yPosition + 15 + (index * 6));
    });

    return yPosition + 35;
  }

  private addClientInfo(data: InvoiceData, yPosition: number): number {
    // Titre Client
    this.doc.setFontSize(this.settings.fontSize + 2);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Facturé à:', this.margin, yPosition);

    // Informations client
    this.doc.setFontSize(this.settings.fontSize);
    this.doc.setFont('helvetica', 'normal');
    
    const clientInfo = [
      data.clientName,
      data.clientAddress || '',
      data.clientEmail || ''
    ].filter(info => info);

    clientInfo.forEach((info, index) => {
      this.doc.text(info, this.margin, yPosition + 10 + (index * 6));
    });

    return yPosition + 10 + (clientInfo.length * 6) + 15;
  }

  private addItemsTable(data: InvoiceData, yPosition: number): number {
    const tableHeaders = ['Description', 'Quantité', 'Prix unitaire', 'Total'];
    const tableData = data.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} XOF`,
      `${item.total.toFixed(2)} XOF`
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
        fontSize: this.settings.fontSize,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: this.settings.fontSize - 1,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto'
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addTotals(data: InvoiceData, yPosition: number): number {
    const totalsX = this.pageWidth - this.margin - 80;
    
    // Sous-total
    this.doc.setFontSize(this.settings.fontSize);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Sous-total:', totalsX, yPosition);
    this.doc.text(`${data.subtotal.toFixed(2)} XOF`, totalsX + 40, yPosition);

    // Taxes si applicables
    if (data.tax && data.tax > 0) {
      yPosition += 8;
      this.doc.text('TVA:', totalsX, yPosition);
      this.doc.text(`${data.tax.toFixed(2)} XOF`, totalsX + 40, yPosition);
    }

    // Total
    yPosition += 12;
    this.doc.setFontSize(this.settings.fontSize + 2);
    this.doc.setFont('helvetica', 'bold');
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.text('TOTAL:', totalsX, yPosition);
    this.doc.text(`${data.total.toFixed(2)} XOF`, totalsX + 40, yPosition);

    return yPosition + 15;
  }

  private addNotes(data: InvoiceData, yPosition: number): number {
    if (!data.notes) return yPosition;

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.settings.fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Notes:', this.margin, yPosition);

    this.doc.setFont('helvetica', 'normal');
    const splitNotes = this.doc.splitTextToSize(data.notes, this.pageWidth - (this.margin * 2));
    this.doc.text(splitNotes, this.margin, yPosition + 8);

    return yPosition + 8 + (splitNotes.length * 6) + 10;
  }

  private addFooter(): void {
    if (!this.settings.includeFooter) return;

    const footerY = this.pageHeight - 20;
    this.doc.setFontSize(this.settings.fontSize - 2);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(128, 128, 128);
    
    const footerText = this.settings.footerText || 'Merci pour votre confiance';
    this.doc.text(footerText, this.pageWidth / 2, footerY, { align: 'center' });
  }

  public generateInvoice(data: InvoiceData): jsPDF {
    let currentY = this.addHeader();
    currentY = this.addInvoiceInfo(data, currentY);
    currentY = this.addClientInfo(data, currentY);
    currentY = this.addItemsTable(data, currentY);
    currentY = this.addTotals(data, currentY);
    currentY = this.addNotes(data, currentY);
    
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
          <head><title>Impression Facture</title></head>
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

// Fonction utilitaire pour générer des données de test
export const generateSampleInvoiceData = (): InvoiceData => ({
  invoiceNumber: 'FAC-2024-001',
  date: new Date().toLocaleDateString('fr-FR'),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
  clientName: 'Client Exemple',
  clientAddress: '123 Rue de la Paix, Dakar, Sénégal',
  clientEmail: 'client@exemple.com',
  items: [
    {
      description: 'Produit 1',
      quantity: 2,
      unitPrice: 15000,
      total: 30000
    },
    {
      description: 'Produit 2',
      quantity: 1,
      unitPrice: 25000,
      total: 25000
    }
  ],
  subtotal: 55000,
  tax: 9900,
  total: 64900,
  notes: 'Merci pour votre achat. Paiement dû sous 30 jours.'
});
