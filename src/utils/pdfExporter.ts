
import { AdvancedPdfGenerator } from "./advancedPdfGenerator";
import { invoiceSettingsService } from "@/services/invoiceSettingsService";
import { format } from "date-fns";

export interface ExportableTransaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

// Fonction pour prévisualiser le PDF
export const previewPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): void => {
  console.log("Création de l'aperçu PDF...");
  try {
    const settings = invoiceSettingsService.getSettings();
    const generator = new AdvancedPdfGenerator(settings);
    const doc = generator.generateInvoice(transactions);
    
    // Ouvrir l'aperçu dans une nouvelle fenêtre
    const pdfDataUri = doc.output('datauristring');
    
    // Créer une nouvelle fenêtre pour l'aperçu
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Aperçu PDF - ${title}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
                background: #f5f5f5;
              }
              .header {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .actions {
                display: flex;
                gap: 10px;
              }
              button {
                background: #2980b9;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
              }
              button:hover {
                background: #3498db;
              }
              .download { background: #27ae60; }
              .download:hover { background: #2ecc71; }
              .print { background: #e67e22; }
              .print:hover { background: #f39c12; }
              iframe {
                width: 100%;
                height: calc(100vh - 120px);
                border: 1px solid #ddd;
                border-radius: 8px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2 style="margin: 0; color: #2c3e50;">Aperçu du document PDF</h2>
              <div class="actions">
                <button onclick="downloadPDF()" class="download">📥 Télécharger</button>
                <button onclick="printPDF()" class="print">🖨️ Imprimer</button>
                <button onclick="window.close()">✕ Fermer</button>
              </div>
            </div>
            <iframe src="${pdfDataUri}" type="application/pdf"></iframe>
            <script>
              function downloadPDF() {
                const link = document.createElement('a');
                link.href = '${pdfDataUri}';
                link.download = '${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf';
                link.click();
              }
              
              function printPDF() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
    } else {
      // Fallback si le popup est bloqué
      window.open(pdfDataUri, '_blank');
    }
    
    console.log("Aperçu PDF créé avec succès");
  } catch (error) {
    console.error("Erreur lors de la création de l'aperçu PDF:", error);
    throw error;
  }
};

// Fonction d'exportation directe
export const exportTransactionsToPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): void => {
  console.log("Export PDF en cours...");
  try {
    const settings = invoiceSettingsService.getSettings();
    const generator = new AdvancedPdfGenerator(settings);
    const doc = generator.generateInvoice(transactions);
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    
    doc.save(fileName);
    console.log("PDF exporté avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    throw error;
  }
};

// Fonction d'impression directe
export const printTransactionsPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): void => {
  console.log("Impression PDF en cours...");
  try {
    const settings = invoiceSettingsService.getSettings();
    const generator = new AdvancedPdfGenerator(settings);
    const doc = generator.generateInvoice(transactions);
    
    // Utilisation du datauristring pour l'impression
    const dataUri = doc.output('datauristring');
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Impression</title></head>
          <body style="margin:0;">
            <iframe width='100%' height='100%' src='${dataUri}' style="border:none;"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.focus();
      setTimeout(() => {
        newWindow.print();
      }, 500);
    } else {
      throw new Error("Impossible d'ouvrir la fenêtre d'impression");
    }
    
    console.log("PDF envoyé à l'impression!");
  } catch (error) {
    console.error("Erreur lors de l'impression PDF:", error);
    throw error;
  }
};
