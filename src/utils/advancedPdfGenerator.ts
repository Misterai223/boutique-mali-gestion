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

  private addModernHeader(clientData: any): number {
    let yPosition = this.margin;

    // Titre FACTURE en gros et gras
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text("FACTURE", this.margin, yPosition + 15);

    // Logo/stamp sur la droite (optionnel)
    if (this.settings.companyInfo.logo) {
      try {
        const logoSize = 25;
        this.doc.addImage(
          this.settings.companyInfo.logo, 
          'PNG', 
          this.pageWidth - this.margin - logoSize - 10, 
          yPosition, 
          logoSize, 
          logoSize * 0.6
        );
      } catch (error) {
        // Dessiner un cercle décoratif simple si pas de logo
        this.doc.setDrawColor(200, 200, 200);
        this.doc.setLineWidth(1);
        this.doc.circle(this.pageWidth - this.margin - 20, yPosition + 10, 15, 'S');
      }
    } else {
      // Cercle décoratif simple
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(1);
      this.doc.circle(this.pageWidth - this.margin - 20, yPosition + 10, 15, 'S');
    }

    yPosition += 30;

    // Informations de la facture dans des capsules
    const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('fr-FR');

    // Capsule numéro de facture
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(1);
    this.doc.roundedRect(this.margin, yPosition, 50, 8, 4, 4, 'S');
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Facture n°${invoiceNumber}`, this.margin + 2, yPosition + 5);

    // Capsule date
    this.doc.roundedRect(this.margin + 55, yPosition, 30, 8, 4, 4, 'S');
    this.doc.text(currentDate, this.margin + 57, yPosition + 5);

    yPosition += 20;

    // Ligne de séparation
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);

    return yPosition + 10;
  }

  private addCompanyAndClientInfo(clientData: any, yPosition: number): number {
    // Informations expéditeur (gauche)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(this.settings.companyInfo.name.toUpperCase(), this.margin, yPosition);

    yPosition += 6;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);

    const companyLines = [
      this.settings.companyInfo.phone,
      this.settings.companyInfo.email,
      this.settings.companyInfo.website || '',
      this.settings.companyInfo.address
    ].filter(line => line);

    companyLines.forEach(line => {
      this.doc.text(line, this.margin, yPosition);
      yPosition += 4;
    });

    // Reset position pour la section client
    const clientStartY = yPosition - (companyLines.length * 4) - 6;

    // Informations destinataire (droite)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.text("À L'ATTENTION DE", this.pageWidth - this.margin - 80, clientStartY);

    let clientY = clientStartY + 6;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.text(clientData.fullName.toUpperCase(), this.pageWidth - this.margin - 80, clientY);

    clientY += 6;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);

    const clientLines = [
      clientData.phoneNumber || '',
      clientData.email || '',
      clientData.address || ''
    ].filter(line => line);

    clientLines.forEach(line => {
      this.doc.text(line, this.pageWidth - this.margin - 80, clientY);
      clientY += 4;
    });

    return Math.max(yPosition, clientY) + 15;
  }

  private addProductsTableModern(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(this.getFontSize());
      this.doc.text("Aucun article", this.margin, yPosition);
      return yPosition + 15;
    }

    const tableHeaders = ['DESCRIPTION', 'PRIX', 'QUANTITÉ', 'TOTAL'];
    const tableData = clientData.purchases.map((purchase: any) => [
      purchase.product.name,
      this.formatCurrency(purchase.product.price),
      purchase.quantity.toString().padStart(2, '0'),
      this.formatCurrency(purchase.quantity * purchase.product.price)
    ]);

    autoTable(this.doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      theme: 'plain',
      headStyles: {
        fillColor: [33, 37, 41], // Noir foncé
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: { top: 6, bottom: 6, left: 4, right: 4 }
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
        valign: 'middle'
      },
      columnStyles: {
        0: { 
          cellWidth: 80,
          halign: 'left',
          fontStyle: 'normal'
        },
        1: { 
          cellWidth: 30,
          halign: 'right',
          fontStyle: 'normal'
        },
        2: { 
          cellWidth: 25,
          halign: 'center',
          fontStyle: 'bold'
        },
        3: { 
          cellWidth: 35,
          halign: 'right',
          fontStyle: 'bold'
        }
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
        overflow: 'linebreak'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addTotalSectionModern(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      return yPosition;
    }

    const subtotal = clientData.purchases.reduce((sum: number, purchase: any) => {
      return sum + (purchase.quantity * purchase.product.price);
    }, 0);

    const tva = subtotal * 0.18; // 18% TVA
    const total = subtotal + tva;

    // Positionnement à droite
    const sectionWidth = 80;
    const sectionX = this.pageWidth - this.margin - sectionWidth;

    yPosition += 5;

    // Sous-total
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.text('Sous total :', sectionX, yPosition);
    this.doc.text(this.formatCurrency(subtotal), this.pageWidth - this.margin - 5, yPosition, { align: 'right' });

    yPosition += 6;

    // TVA
    this.doc.text('TVA (18%) :', sectionX, yPosition);
    this.doc.text(this.formatCurrency(tva), this.pageWidth - this.margin - 5, yPosition, { align: 'right' });

    yPosition += 10;

    // Total final avec fond noir
    this.doc.setFillColor(33, 37, 41);
    this.doc.rect(sectionX - 2, yPosition - 4, sectionWidth + 2, 12, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('TOTAL :', sectionX, yPosition + 3);
    this.doc.text(this.formatCurrency(total), this.pageWidth - this.margin - 5, yPosition + 3, { align: 'right' });

    // Reset text color
    this.doc.setTextColor(0, 0, 0);

    return yPosition + 25;
  }

  private addPaymentInfo(clientData: any, yPosition: number): void {
    yPosition += 10;

    // Informations de paiement
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.text(`Paiement à l'ordre de ${this.settings.companyInfo.name}`, this.margin, yPosition);
    
    yPosition += 5;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    
    if (this.settings.companyInfo.taxNumber) {
      this.doc.text(`N° de compte ${this.settings.companyInfo.taxNumber}`, this.margin, yPosition);
    }

    // Conditions de paiement (droite)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('Conditions de paiement', this.pageWidth - this.margin - 50, yPosition - 5);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.text('Paiement sous 30 jours', this.pageWidth - this.margin - 50, yPosition);

    // Message de remerciement centré
    yPosition += 20;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    const thankYouText = 'MERCI DE VOTRE CONFIANCE';
    const textWidth = this.doc.getTextWidth(thankYouText);
    this.doc.text(thankYouText, (this.pageWidth - textWidth) / 2, yPosition);
  }

  public generateClientInvoice(clientData: any): jsPDF {
    let currentY = this.addModernHeader(clientData);
    currentY = this.addCompanyAndClientInfo(clientData, currentY);
    currentY = this.addProductsTableModern(clientData, currentY);
    currentY = this.addTotalSectionModern(clientData, currentY);
    
    this.addPaymentInfo(clientData, currentY);

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
