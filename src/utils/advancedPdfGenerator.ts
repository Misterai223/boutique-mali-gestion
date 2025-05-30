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
      maximumFractionDigits: 0,
      useGrouping: true
    }).format(amount).replace(/\s/g, ' ') + ' ' + this.settings.currency;
  }

  private addPremiumHeader(clientData: any): number {
    let yPosition = this.margin;
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    const accentRgb = this.hexToRgb(this.settings.accentColor);

    // Bande supérieure colorée avec dégradé visuel
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.rect(0, 0, this.pageWidth, 50, 'F');

    // Logo premium avec cadre
    if (this.settings.companyInfo.logo) {
      try {
        const logoSize = 35;
        let logoX = this.margin + 5;
        
        // Cadre blanc autour du logo
        this.doc.setFillColor(255, 255, 255);
        this.doc.roundedRect(logoX - 3, yPosition + 2, logoSize + 6, logoSize * 0.7 + 6, 5, 5, 'F');
        
        this.doc.addImage(
          this.settings.companyInfo.logo, 
          'PNG', 
          logoX, 
          yPosition + 5, 
          logoSize, 
          logoSize * 0.7
        );
      } catch (error) {
        // Logo de remplacement élégant
        this.doc.setFillColor(255, 255, 255);
        this.doc.roundedRect(this.margin + 2, yPosition + 2, 40, 28, 8, 8, 'F');
        this.doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(16);
        this.doc.text(this.settings.companyInfo.name.substring(0, 2).toUpperCase(), this.margin + 15, yPosition + 20);
      }
    }

    // Titre FACTURE stylé
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(42);
    const titleX = this.pageWidth - this.margin - 80;
    this.doc.text("FACTURE", titleX, yPosition + 25);

    // Sous-titre élégant
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text("Document commercial", titleX, yPosition + 35);

    yPosition += 60;

    // Section informations avec design en cartes
    this.addInfoCards(clientData, yPosition);

    return yPosition + 45;
  }

  private addInfoCards(clientData: any, yPosition: number): void {
    const cardWidth = (this.pageWidth - this.margin * 2 - 15) / 2;
    const cardHeight = 35;
    const accentRgb = this.hexToRgb(this.settings.accentColor);

    // Carte Expéditeur
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(this.margin, yPosition, cardWidth, cardHeight, 6, 6, 'F');
    this.doc.setDrawColor(220, 220, 220);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(this.margin, yPosition, cardWidth, cardHeight, 6, 6, 'S');

    // En-tête de carte expéditeur
    this.doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.roundedRect(this.margin, yPosition, cardWidth, 8, 6, 6, 'F');
    this.doc.rect(this.margin, yPosition + 4, cardWidth, 4, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.text("EXPÉDITEUR", this.margin + 3, yPosition + 6);

    // Contenu expéditeur
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.text(this.settings.companyInfo.name, this.margin + 3, yPosition + 15);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    const senderLines = [
      this.settings.companyInfo.address,
      this.settings.companyInfo.phone,
      this.settings.companyInfo.email
    ].filter(line => line);

    senderLines.forEach((line, index) => {
      this.doc.text(line, this.margin + 3, yPosition + 21 + (index * 3.5));
    });

    // Carte Destinataire
    const destX = this.margin + cardWidth + 15;
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(destX, yPosition, cardWidth, cardHeight, 6, 6, 'F');
    this.doc.setDrawColor(220, 220, 220);
    this.doc.roundedRect(destX, yPosition, cardWidth, cardHeight, 6, 6, 'S');

    // En-tête de carte destinataire
    this.doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.roundedRect(destX, yPosition, cardWidth, 8, 6, 6, 'F');
    this.doc.rect(destX, yPosition + 4, cardWidth, 4, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.text("DESTINATAIRE", destX + 3, yPosition + 6);

    // Contenu destinataire
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.text(clientData.fullName || "Client", destX + 3, yPosition + 15);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    const clientLines = [
      clientData.address || "",
      clientData.phoneNumber || "",
      clientData.email || ""
    ].filter(line => line);

    clientLines.forEach((line, index) => {
      this.doc.text(line, destX + 3, yPosition + 21 + (index * 3.5));
    });

    // Informations de facturation en badges
    this.addInvoiceBadges(yPosition + cardHeight + 10);
  }

  private addInvoiceBadges(yPosition: number): void {
    const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');

    const badgeData = [
      { label: "N° FACTURE", value: invoiceNumber, color: this.settings.primaryColor },
      { label: "DATE", value: currentDate, color: this.settings.accentColor },
      { label: "ÉCHÉANCE", value: dueDate, color: "#e74c3c" }
    ];

    const badgeWidth = 55;
    const badgeHeight = 12;
    const spacing = 10;
    let currentX = this.margin;

    badgeData.forEach((badge, index) => {
      const rgb = this.hexToRgb(badge.color);
      
      // Badge principal
      this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
      this.doc.roundedRect(currentX, yPosition, badgeWidth, badgeHeight, 4, 4, 'F');

      // Texte du badge
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7);
      this.doc.text(badge.label, currentX + 2, yPosition + 4);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.text(badge.value, currentX + 2, yPosition + 9);

      currentX += badgeWidth + spacing;
    });
  }

  private addPremiumTable(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(this.getFontSize());
      this.doc.text("Aucun article", this.margin, yPosition);
      return yPosition + 15;
    }

    yPosition += 20;

    const tableHeaders = ['DÉSIGNATION', 'P.U. HT', 'QTÉ', 'TOTAL HT'];
    const tableData = clientData.purchases.map((purchase: any) => [
      purchase.product.name,
      this.formatCurrency(purchase.product.price),
      purchase.quantity.toString(),
      this.formatCurrency(purchase.quantity * purchase.product.price)
    ]);

    const primaryRgb = this.hexToRgb(this.settings.primaryColor);

    autoTable(this.doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      theme: 'plain',
      headStyles: {
        fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: { top: 8, bottom: 8, left: 5, right: 5 }
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: { top: 6, bottom: 6, left: 5, right: 5 },
        valign: 'middle',
        textColor: [33, 37, 41]
      },
      columnStyles: {
        0: { 
          cellWidth: 'auto',
          halign: 'left',
          fontStyle: 'normal',
          minCellWidth: 60
        },
        1: { 
          cellWidth: 35,
          halign: 'right',
          fontStyle: 'normal'
        },
        2: { 
          cellWidth: 20,
          halign: 'center',
          fontStyle: 'bold'
        },
        3: { 
          cellWidth: 40,
          halign: 'right',
          fontStyle: 'bold',
          textColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b]
        }
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      didParseCell: (data) => {
        // Bordures arrondies pour les en-têtes
        if (data.section === 'head') {
          data.cell.styles.fillColor = [primaryRgb.r, primaryRgb.g, primaryRgb.b];
        }
      }
    });

    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addPremiumTotalSection(clientData: any, yPosition: number): number {
    if (!clientData.purchases || clientData.purchases.length === 0) {
      return yPosition;
    }

    const subtotal = clientData.purchases.reduce((sum: number, purchase: any) => {
      return sum + (purchase.quantity * purchase.product.price);
    }, 0);

    const tvaRate = 0.18;
    const tva = subtotal * tvaRate;
    const total = subtotal + tva;

    // Section totaux avec design premium
    const sectionWidth = 85;
    const sectionX = this.pageWidth - this.margin - sectionWidth;
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);

    yPosition += 10;

    // Cadre principal des totaux
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(sectionX - 5, yPosition - 5, sectionWidth + 10, 45, 8, 8, 'F');
    this.doc.setDrawColor(220, 220, 220);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(sectionX - 5, yPosition - 5, sectionWidth + 10, 45, 8, 8, 'S');

    // Sous-total
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(60, 60, 60);
    this.doc.text('Sous-total HT', sectionX, yPosition + 3);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(subtotal), this.pageWidth - this.margin - 5, yPosition + 3, { align: 'right' });

    yPosition += 8;

    // TVA
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`TVA (${(tvaRate * 100).toFixed(0)}%)`, sectionX, yPosition + 3);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(tva), this.pageWidth - this.margin - 5, yPosition + 3, { align: 'right' });

    yPosition += 12;

    // Total TTC avec design premium
    this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.roundedRect(sectionX - 3, yPosition - 2, sectionWidth + 6, 16, 6, 6, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.text('TOTAL TTC', sectionX, yPosition + 6);
    this.doc.setFontSize(16);
    this.doc.text(this.formatCurrency(total), this.pageWidth - this.margin - 5, yPosition + 9, { align: 'right' });

    this.doc.setTextColor(0, 0, 0);

    return yPosition + 30;
  }

  private addPremiumFooter(clientData: any, yPosition: number): void {
    yPosition += 15;

    // Section conditions et paiement
    const sectionWidth = (this.pageWidth - this.margin * 2 - 15) / 2;
    const accentRgb = this.hexToRgb(this.settings.accentColor);

    // Conditions de paiement
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(this.margin, yPosition, sectionWidth, 25, 6, 6, 'F');
    this.doc.setDrawColor(220, 220, 220);
    this.doc.roundedRect(this.margin, yPosition, sectionWidth, 25, 6, 6, 'S');

    this.doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.roundedRect(this.margin, yPosition, sectionWidth, 6, 6, 6, 'F');
    this.doc.rect(this.margin, yPosition + 3, sectionWidth, 3, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.text("CONDITIONS DE PAIEMENT", this.margin + 3, yPosition + 4);

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.text("• Paiement sous 30 jours", this.margin + 3, yPosition + 12);
    this.doc.text("• Pénalités de retard: 3% par mois", this.margin + 3, yPosition + 17);
    this.doc.text("• Escompte: 2% si paiement à 8 jours", this.margin + 3, yPosition + 22);

    // Informations bancaires
    const bankX = this.margin + sectionWidth + 15;
    this.doc.setFillColor(248, 249, 250);
    this.doc.roundedRect(bankX, yPosition, sectionWidth, 25, 6, 6, 'F');
    this.doc.setDrawColor(220, 220, 220);
    this.doc.roundedRect(bankX, yPosition, sectionWidth, 25, 6, 6, 'S');

    this.doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
    this.doc.roundedRect(bankX, yPosition, sectionWidth, 6, 6, 6, 'F');
    this.doc.rect(bankX, yPosition + 3, sectionWidth, 3, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.text("COORDONNÉES BANCAIRES", bankX + 3, yPosition + 4);

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.text(`Bénéficiaire: ${this.settings.companyInfo.name}`, bankX + 3, yPosition + 12);
    if (this.settings.companyInfo.taxNumber) {
      this.doc.text(`IBAN: ${this.settings.companyInfo.taxNumber}`, bankX + 3, yPosition + 17);
    }
    this.doc.text("Référence: Facture", bankX + 3, yPosition + 22);

    // Message de remerciement stylé
    yPosition += 35;
    const primaryRgb = this.hexToRgb(this.settings.primaryColor);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    const thankYouText = 'MERCI POUR VOTRE CONFIANCE';
    const textWidth = this.doc.getTextWidth(thankYouText);
    this.doc.text(thankYouText, (this.pageWidth - textWidth) / 2, yPosition);

    // Ligne décorative
    this.doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    this.doc.setLineWidth(1);
    const lineWidth = 40;
    this.doc.line((this.pageWidth - lineWidth) / 2, yPosition + 3, (this.pageWidth + lineWidth) / 2, yPosition + 3);
  }

  public generateClientInvoice(clientData: any): jsPDF {
    console.log("Generating client invoice for:", clientData.fullName);
    try {
      let currentY = this.addPremiumHeader(clientData);
      currentY = this.addPremiumTable(clientData, currentY);
      currentY = this.addPremiumTotalSection(clientData, currentY);
      
      this.addPremiumFooter(clientData, currentY);

      console.log("Invoice generated successfully");
      return this.doc;
    } catch (error) {
      console.error("Error generating client invoice:", error);
      throw error;
    }
  }

  public generateInvoice(data: any[]): jsPDF {
    console.log("Generating transaction report");
    try {
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
      console.log("Transaction report generated successfully");
      return this.doc;
    } catch (error) {
      console.error("Error generating transaction report:", error);
      throw error;
    }
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
    try {
      console.log("Downloading PDF:", filename);
      this.doc.save(filename);
      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  public printPDF(): void {
    try {
      console.log("Printing PDF");
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
        console.log("PDF sent to printer");
      } else {
        throw new Error("Unable to open print window");
      }
    } catch (error) {
      console.error("Error printing PDF:", error);
      throw error;
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
  fontFamily: 'helvetica',
  includeHeader: true,
  includeFooter: true,
  headerText: "Rapport",
  footerText: "Merci pour votre confiance",
  currency: "F CFA",
  dateFormat: 'DD/MM/YYYY',
  theme: {
    templateStyle: 'premium',
    headerStyle: 'gradient',
    cardStyle: 'rounded',
    tableStyle: 'modern',
    shadowIntensity: 'medium',
    borderRadius: 6,
    spacing: 'normal'
  },
  ...overrides
});
