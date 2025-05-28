
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { InvoiceSettings, InvoiceData } from "@/types/invoice";
import { invoiceSettingsService } from "@/services/invoiceSettingsService";

export class AdvancedPdfGenerator {
  private doc: jsPDF;
  private settings: InvoiceSettings;
  private pageWidth: number;
  private pageHeight: number;
  private margins = { top: 20, right: 20, bottom: 20, left: 20 };

  constructor(settings?: InvoiceSettings) {
    this.settings = settings || invoiceSettingsService.getSettings();
    
    const orientation = this.settings.orientation === 'landscape' ? 'l' : 'p';
    const format = this.settings.pageSize.toLowerCase() as 'a4' | 'letter';
    
    this.doc = new jsPDF(orientation, 'mm', format);
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private getFontSize(size: 'small' | 'medium' | 'large'): number {
    switch (size) {
      case 'small': return 8;
      case 'medium': return 10;
      case 'large': return 12;
      default: return 10;
    }
  }

  private getLogoSize(): { width: number; height: number } {
    switch (this.settings.logoSize) {
      case 'small': return { width: 20, height: 20 };
      case 'medium': return { width: 30, height: 30 };
      case 'large': return { width: 40, height: 40 };
      default: return { width: 30, height: 30 };
    }
  }

  private addHeader(title: string = "Facture"): number {
    if (!this.settings.includeHeader) return this.margins.top;

    let currentY = this.margins.top;
    const { companyInfo } = this.settings;
    const logoSize = this.getLogoSize();

    // Background header
    const [r, g, b] = this.hexToRgb(this.settings.primaryColor);
    this.doc.setFillColor(r, g, b);
    this.doc.rect(0, 0, this.pageWidth, 50, 'F');

    // Logo and company info positioning
    let logoX = this.margins.left;
    let companyX = this.margins.left + logoSize.width + 10;

    if (this.settings.logoPosition === 'center') {
      logoX = (this.pageWidth - logoSize.width) / 2;
      companyX = logoX + logoSize.width + 10;
    } else if (this.settings.logoPosition === 'right') {
      logoX = this.pageWidth - this.margins.right - logoSize.width;
      companyX = logoX - 100;
    }

    // Add logo if available
    if (companyInfo.logo) {
      try {
        this.doc.addImage(
          companyInfo.logo, 
          'JPEG', 
          logoX, 
          currentY + 5, 
          logoSize.width, 
          logoSize.height
        );
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
    }

    // Company information
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(companyInfo.name, companyX, currentY + 12);

    this.doc.setFontSize(this.getFontSize('small'));
    this.doc.setFont("helvetica", "normal");
    if (companyInfo.address) {
      this.doc.text(companyInfo.address, companyX, currentY + 20);
    }
    if (companyInfo.phone) {
      this.doc.text(`Tél: ${companyInfo.phone}`, companyX, currentY + 26);
    }
    if (companyInfo.email) {
      this.doc.text(`Email: ${companyInfo.email}`, companyX, currentY + 32);
    }

    // Title
    if (this.settings.headerText) {
      this.doc.setFontSize(20);
      this.doc.setFont("helvetica", "bold");
      const titleWidth = this.doc.getTextWidth(this.settings.headerText);
      this.doc.text(this.settings.headerText, this.pageWidth - this.margins.right - titleWidth, currentY + 25);
    }

    return 60; // Return Y position after header
  }

  private addFooter(): void {
    if (!this.settings.includeFooter) return;

    const footerY = this.pageHeight - this.margins.bottom - 10;
    
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(0, footerY - 5, this.pageWidth, 15, 'F');

    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(this.getFontSize('small'));
    this.doc.setFont("helvetica", "normal");

    if (this.settings.footerText) {
      const textWidth = this.doc.getTextWidth(this.settings.footerText);
      this.doc.text(this.settings.footerText, (this.pageWidth - textWidth) / 2, footerY);
    }

    // Date generation
    const dateText = `Généré le ${format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}`;
    this.doc.text(dateText, this.margins.left, footerY + 8);

    // Page number - using a simpler approach since getCurrentPageInfo may not exist
    const pageText = `Page 1`;
    const pageWidth = this.doc.getTextWidth(pageText);
    this.doc.text(pageText, this.pageWidth - this.margins.right - pageWidth, footerY + 8);
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [41, 128, 185];
  }

  generateInvoice(data: InvoiceData[], title: string = "Facture"): jsPDF {
    let currentY = this.addHeader(title);

    // Invoice details section
    currentY += 10;
    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(this.getFontSize('medium'));
    this.doc.setFont("helvetica", "bold");

    // Invoice number and date
    const invoiceNumber = `#${Date.now().toString().slice(-6)}`;
    const currentDate = format(new Date(), 
      this.settings.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' :
      this.settings.dateFormat === 'MM/DD/YYYY' ? 'MM/dd/yyyy' : 'yyyy-MM-dd'
    );

    this.doc.text(`Facture N°: ${invoiceNumber}`, this.margins.left, currentY);
    this.doc.text(`Date: ${currentDate}`, this.pageWidth - this.margins.right - 60, currentY);

    currentY += 20;

    // Summary statistics
    const totalIncome = data.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = data.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Stats boxes
    this.addStatsBoxes(currentY, totalIncome, totalExpense, balance);
    currentY += 40;

    // Table data
    const tableData = data.map(item => {
      const date = format(new Date(item.date), 
        this.settings.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' :
        this.settings.dateFormat === 'MM/DD/YYYY' ? 'MM/dd/yyyy' : 'yyyy-MM-dd'
      );
      return [
        date,
        item.description,
        item.category,
        item.type === "income" ? "Revenu" : "Dépense",
        `${item.amount.toLocaleString()} ${this.settings.currency}`
      ];
    });

    // Generate table
    const [headR, headG, headB] = this.hexToRgb(this.settings.primaryColor);
    autoTable(this.doc, {
      startY: currentY,
      head: [["Date", "Description", "Catégorie", "Type", "Montant"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [headR, headG, headB] as [number, number, number],
        textColor: [255, 255, 255] as [number, number, number],
        fontSize: this.getFontSize(this.settings.fontSize),
        fontStyle: "bold",
        halign: "center"
      },
      bodyStyles: {
        fontSize: this.getFontSize(this.settings.fontSize),
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245] as [number, number, number]
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 25 },
        1: { halign: "left", cellWidth: 60 },
        2: { halign: "center", cellWidth: 30 },
        3: { halign: "center", cellWidth: 25 },
        4: { halign: "right", cellWidth: 35 }
      },
      margin: { left: this.margins.left, right: this.margins.right },
      didDrawPage: () => {
        this.addFooter();
      }
    });

    // Final summary
    const finalY = (this.doc as any).lastAutoTable?.finalY + 15 || currentY + 100;
    this.addFinalSummary(finalY, data.length, totalIncome, totalExpense, balance);

    this.addFooter();
    return this.doc;
  }

  private addStatsBoxes(y: number, income: number, expense: number, balance: number): void {
    const boxWidth = 50;
    const boxHeight = 25;
    const spacing = 10;
    const startX = (this.pageWidth - (3 * boxWidth + 2 * spacing)) / 2;

    // Income box
    this.doc.setFillColor(46, 204, 113);
    this.doc.rect(startX, y, boxWidth, boxHeight, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.getFontSize('small'));
    this.doc.text("REVENUS", startX + 2, y + 8);
    this.doc.setFontSize(this.getFontSize('medium'));
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`${income.toLocaleString()}`, startX + 2, y + 15);
    this.doc.text(this.settings.currency, startX + 2, y + 20);

    // Expense box
    this.doc.setFillColor(231, 76, 60);
    this.doc.rect(startX + boxWidth + spacing, y, boxWidth, boxHeight, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.getFontSize('small'));
    this.doc.text("DÉPENSES", startX + boxWidth + spacing + 2, y + 8);
    this.doc.setFontSize(this.getFontSize('medium'));
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`${expense.toLocaleString()}`, startX + boxWidth + spacing + 2, y + 15);
    this.doc.text(this.settings.currency, startX + boxWidth + spacing + 2, y + 20);

    // Balance box
    const balanceColor: [number, number, number] = balance >= 0 ? [46, 204, 113] : [231, 76, 60];
    this.doc.setFillColor(...balanceColor);
    this.doc.rect(startX + 2 * (boxWidth + spacing), y, boxWidth, boxHeight, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.getFontSize('small'));
    this.doc.text("SOLDE", startX + 2 * (boxWidth + spacing) + 2, y + 8);
    this.doc.setFontSize(this.getFontSize('medium'));
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`${balance.toLocaleString()}`, startX + 2 * (boxWidth + spacing) + 2, y + 15);
    this.doc.text(this.settings.currency, startX + 2 * (boxWidth + spacing) + 2, y + 20);
  }

  private addFinalSummary(y: number, count: number, income: number, expense: number, balance: number): void {
    if (y > this.pageHeight - 60) {
      this.doc.addPage();
      y = this.margins.top;
    }

    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(this.margins.left, y, this.pageWidth - this.margins.left - this.margins.right, 35, 'F');
    const [borderR, borderG, borderB] = this.hexToRgb(this.settings.primaryColor);
    this.doc.setDrawColor(borderR, borderG, borderB);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margins.left, y, this.pageWidth - this.margins.left - this.margins.right, 35, 'S');

    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(this.getFontSize('large'));
    this.doc.setFont("helvetica", "bold");
    this.doc.text("RÉSUMÉ FINANCIER", this.margins.left + 5, y + 10);

    this.doc.setFontSize(this.getFontSize('medium'));
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`Nombre de transactions: ${count}`, this.margins.left + 5, y + 18);
    this.doc.text(`Total des revenus: ${income.toLocaleString()} ${this.settings.currency}`, this.margins.left + 5, y + 24);
    this.doc.text(`Total des dépenses: ${expense.toLocaleString()} ${this.settings.currency}`, this.margins.left + 5, y + 30);

    const balanceColor: [number, number, number] = balance >= 0 ? [46, 204, 113] : [231, 76, 60];
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(...balanceColor);
    this.doc.text(`Solde final: ${balance.toLocaleString()} ${this.settings.currency}`, this.pageWidth - this.margins.right - 80, y + 24);
  }

  save(filename: string): void {
    this.doc.save(filename);
  }

  output(type: string): any {
    return this.doc.output(type);
  }
}
