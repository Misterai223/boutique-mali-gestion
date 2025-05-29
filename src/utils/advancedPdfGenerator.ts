import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InvoiceSettings, InvoiceData } from '@/types/invoice';

export class AdvancedPdfGenerator {
  private doc: jsPDF;
  private settings: InvoiceSettings;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 15;

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
      small: 9,
      medium: 10,
      large: 12
    };
    return sizeMap[this.settings.fontSize] || 10;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' ' + this.settings.currency;
  }

  private addCompanyHeader(): number {
    let yPosition = this.margin;

    // En-tête avec design moderne
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.rect(0, 0, this.pageWidth, 45, 'F');

    // Logo de l'entreprise (optimisé)
    if (this.settings.companyInfo.logo) {
      try {
        const logoSize = this.settings.logoSize === 'small' ? 20 : this.settings.logoSize === 'large' ? 30 : 25;
        this.doc.addImage(this.settings.companyInfo.logo, 'PNG', this.margin, yPosition + 5, logoSize, logoSize * 0.6);
      } catch (error) {
        console.warn('Logo non disponible:', error);
      }
    }

    // Nom de l'entreprise en blanc et en gras
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    const companyNameX = this.settings.companyInfo.logo ? this.margin + 35 : this.margin;
    this.doc.text(this.settings.companyInfo.name, companyNameX, yPosition + 18);

    // Slogan ou description courte
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Solutions commerciales professionnelles', companyNameX, yPosition + 25);

    yPosition += 55;

    // Section informations entreprise - mieux organisée
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize());
    this.doc.setFont('helvetica', 'bold');
    this.doc.text("EXPÉDITEUR", this.margin, yPosition);
    
    // Cadre moderne pour les informations
    this.doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.setLineWidth(1);
    this.doc.rect(this.margin, yPosition + 3, 75, 35);
    
    // Fond léger
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b, 0.05);
    this.doc.rect(this.margin, yPosition + 3, 75, 35, 'F');

    yPosition += 10;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(this.getFontSize() - 1);
    
    const companyInfo = [
      this.settings.companyInfo.address,
      `Tél: ${this.settings.companyInfo.phone}`,
      `Email: ${this.settings.companyInfo.email}`,
      this.settings.companyInfo.website ? `${this.settings.companyInfo.website}` : '',
      this.settings.companyInfo.taxNumber ? `NINEA: ${this.settings.companyInfo.taxNumber}` : ''
    ].filter(info => info);

    companyInfo.forEach((info, index) => {
      // Limiter la largeur du texte pour éviter les débordements
      const textLines = this.doc.splitTextToSize(info, 68);
      if (Array.isArray(textLines)) {
        textLines.forEach((line, lineIndex) => {
          this.doc.text(line, this.margin + 2, yPosition + (index * 5) + (lineIndex * 4));
        });
      } else {
        this.doc.text(textLines, this.margin + 2, yPosition + (index * 5));
      }
    });

    return yPosition + 35;
  }

  private addInvoiceHeader(clientData: any, yPosition: number): number {
    // Titre FACTURE stylé
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text("FACTURE", this.pageWidth - this.margin - 40, yPosition - 35);

    // Informations facture dans un cadre
    this.doc.setDrawColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setLineWidth(1);
    this.doc.rect(this.pageWidth - this.margin - 65, yPosition - 25, 60, 20);
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize() - 1);
    this.doc.setFont('helvetica', 'bold');
    
    const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    this.doc.text(`N°: ${invoiceNumber}`, this.pageWidth - this.margin - 62, yPosition - 18);
    this.doc.text(`Date: ${currentDate}`, this.pageWidth - this.margin - 62, yPosition - 12);

    return yPosition;
  }

  private addClientInfo(clientData: any, yPosition: number): number {
    // Informations client bien structurées
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(this.getFontSize());
    this.doc.setTextColor(0, 0, 0);
    this.doc.text("DESTINATAIRE", this.pageWidth - this.margin - 65, yPosition);

    // Cadre moderne pour le client
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.setLineWidth(1);
    this.doc.rect(this.pageWidth - this.margin - 65, yPosition + 3, 60, 30);
    
    // Fond léger
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b, 0.05);
    this.doc.rect(this.pageWidth - this.margin - 65, yPosition + 3, 60, 30, 'F');

    yPosition += 10;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(this.getFontSize() - 1);

    const clientInfo = [
      clientData.fullName || 'Client',
      clientData.phoneNumber || '',
      clientData.email || '',
      clientData.address || ''
    ].filter(info => info);

    clientInfo.forEach((info, index) => {
      // Limiter la largeur et gérer les débordements
      const textLines = this.doc.splitTextToSize(info, 55);
      if (Array.isArray(textLines)) {
        textLines.forEach((line, lineIndex) => {
          this.doc.text(line, this.pageWidth - this.margin - 62, yPosition + (index * 5) + (lineIndex * 4));
        });
      } else {
        this.doc.text(textLines, this.pageWidth - this.margin - 62, yPosition + (index * 5));
      }
    });

    return yPosition + 35;
  }

  private addProductsTable(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(this.getFontSize());
      this.doc.text("Aucun article", this.margin, yPosition);
      return yPosition + 15;
    }

    // Titre de section
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(this.getFontSize() + 1);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text("DÉTAIL DES ARTICLES", this.margin, yPosition);
    yPosition += 8;

    const tableHeaders = ['Description', 'Qté', 'Prix Unit.', 'Total'];
    const tableData = clientData.purchases.map((purchase: any) => [
      purchase.product.name,
      purchase.quantity.toString(),
      this.formatCurrency(purchase.product.price),
      this.formatCurrency(purchase.quantity * purchase.product.price)
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
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4
      },
      bodyStyles: {
        fontSize: this.getFontSize() - 1,
        cellPadding: 3,
        valign: 'middle'
      },
      columnStyles: {
        0: { 
          cellWidth: 'auto', 
          halign: 'left',
          fontStyle: 'normal'
        },
        1: { 
          cellWidth: 15, 
          halign: 'center',
          fontStyle: 'bold'
        },
        2: { 
          cellWidth: 25, 
          halign: 'right',
          fontStyle: 'normal'
        },
        3: { 
          cellWidth: 30, 
          halign: 'right',
          fontStyle: 'bold'
        }
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto',
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addTotalSection(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      return yPosition;
    }

    const subtotal = clientData.purchases.reduce((sum: number, purchase: any) => {
      return sum + (purchase.quantity * purchase.product.price);
    }, 0);

    // Section totaux bien structurée
    const totalSectionWidth = 80;
    const totalSectionX = this.pageWidth - this.margin - totalSectionWidth;

    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.line(totalSectionX, yPosition, this.pageWidth - this.margin, yPosition);

    yPosition += 5;

    // Sous-total
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(this.getFontSize());
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Sous-total:', totalSectionX, yPosition);
    this.doc.text(this.formatCurrency(subtotal), this.pageWidth - this.margin - 5, yPosition, { align: 'right' });

    yPosition += 6;

    // TVA (si applicable)
    const tva = 0; // Pas de TVA pour l'instant
    this.doc.text('TVA (0%):', totalSectionX, yPosition);
    this.doc.text(this.formatCurrency(tva), this.pageWidth - this.margin - 5, yPosition, { align: 'right' });

    yPosition += 8;

    // Total final - bien mis en évidence
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b, 0.1);
    this.doc.rect(totalSectionX - 2, yPosition - 3, totalSectionWidth + 2, 12, 'F');
    
    this.doc.setDrawColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setLineWidth(1);
    this.doc.rect(totalSectionX - 2, yPosition - 3, totalSectionWidth + 2, 12);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(this.getFontSize() + 2);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.text('TOTAL À PAYER:', totalSectionX, yPosition + 3);
    
    this.doc.setFontSize(this.getFontSize() + 3);
    this.doc.text(this.formatCurrency(subtotal), this.pageWidth - this.margin - 5, yPosition + 3, { align: 'right' });

    return yPosition + 20;
  }

  private addFooter(): void {
    if (!this.settings.includeFooter) return;

    const footerY = this.pageHeight - 20;
    
    // Ligne de séparation élégante
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.setLineWidth(0.8);
    this.doc.line(this.margin, footerY - 8, this.pageWidth - this.margin, footerY - 8);

    // Texte du pied de page centré et stylé
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(this.getFontSize() - 2);
    
    const footerText = this.settings.footerText || 'Merci pour votre confiance - Règlement à 30 jours';
    this.doc.text(footerText, this.pageWidth / 2, footerY - 2, { align: 'center' });

    // Informations légales
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(this.getFontSize() - 3);
    this.doc.text('Document généré automatiquement', this.margin, footerY + 3);
    this.doc.text(`Page 1 - ${new Date().toLocaleDateString('fr-FR')}`, this.pageWidth - this.margin, footerY + 3, { align: 'right' });
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

  public generateInvoice(data: any[]): jsPDF {
    let currentY = this.margin;

    // En-tête amélioré pour les rapports
    const headerPrimaryRgb = this.hexToRgb(this.settings.primaryColor);
    this.doc.setFillColor(headerPrimaryRgb.r, headerPrimaryRgb.g, headerPrimaryRgb.b);
    this.doc.rect(0, 0, this.pageWidth, 35, 'F');

    // Logo et nom d'entreprise
    if (this.settings.companyInfo.logo) {
      try {
        const logoSize = this.settings.logoSize === 'small' ? 18 : this.settings.logoSize === 'large' ? 28 : 23;
        let logoX = this.margin;
        
        if (this.settings.logoPosition === 'center') {
          logoX = (this.pageWidth - logoSize) / 2;
        } else if (this.settings.logoPosition === 'right') {
          logoX = this.pageWidth - this.margin - logoSize;
        }
        
        this.doc.addImage(this.settings.companyInfo.logo, 'PNG', logoX, currentY + 3, logoSize, logoSize * 0.6);
      } catch (error) {
        console.warn('Logo non disponible:', error);
      }
    }

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.getFontSize() + 4);
    this.doc.setFont('helvetica', 'bold');
    const companyNameX = this.settings.logoPosition === 'left' && this.settings.companyInfo.logo ? this.margin + 30 : this.margin;
    this.doc.text(this.settings.companyInfo.name, companyNameX, currentY + 12);

    currentY += 45;

    // Informations entreprise compactes
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(this.getFontSize() - 1);
    this.doc.setFont('helvetica', 'normal');
    
    const companyInfo = [
      this.settings.companyInfo.address,
      this.settings.companyInfo.phone,
      this.settings.companyInfo.email
    ].filter(info => info);

    companyInfo.forEach((info, index) => {
      this.doc.text(info, this.margin, currentY + (index * 4));
    });
    
    // Titre du rapport stylé
    const accentRgb = this.hexToRgb(this.settings.accentColor);
    this.doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.setFontSize(this.getFontSize() + 6);
    this.doc.setFont('helvetica', 'bold');
    const headerText = this.settings.headerText || 'RAPPORT FINANCIER';
    this.doc.text(headerText, this.pageWidth - this.margin - 50, currentY + 5);

    currentY += 25;

    // Tableau des transactions optimisé
    const tableHeaders = ['Description', 'Type', 'Montant', 'Date', 'Catégorie'];
    const tableData = data.map(transaction => [
      transaction.description,
      transaction.type === 'income' ? 'Recette' : 'Dépense',
      this.formatCurrency(transaction.amount),
      new Date(transaction.date).toLocaleDateString('fr-FR'),
      transaction.category
    ]);

    const tablePrimaryRgb = this.hexToRgb(this.settings.primaryColor);

    autoTable(this.doc, {
      head: [tableHeaders],
      body: tableData,
      startY: currentY,
      theme: 'striped',
      headStyles: {
        fillColor: [tablePrimaryRgb.r, tablePrimaryRgb.g, tablePrimaryRgb.b],
        textColor: [255, 255, 255],
        fontSize: this.getFontSize(),
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: this.getFontSize() - 1,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' }
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap'
      }
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
