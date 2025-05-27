
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ExportableTransaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

// Fonction pour créer un PDF avec une mise en forme améliorée
const createPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): jsPDF => {
  const doc = new jsPDF();
  
  // Configuration des couleurs
  const primaryColor: [number, number, number] = [41, 128, 185]; // Bleu
  const lightGray: [number, number, number] = [245, 245, 245];
  const darkGray: [number, number, number] = [64, 64, 64];
  const greenColor: [number, number, number] = [46, 204, 113];
  const redColor: [number, number, number] = [231, 76, 60];
  
  // En-tête avec logo et informations entreprise
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Titre principal en blanc
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 20);
  
  // Date de génération
  const currentDate = format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Généré le ${currentDate}`, 20, 28);
  
  // Informations de l'entreprise
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(10);
  doc.text("Mon Commerce", 150, 20);
  doc.text("Gestion des Finances", 150, 25);
  doc.text("contact@moncommerce.com", 150, 30);
  
  // Ligne de séparation
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(20, 40, 190, 40);
  
  // Statistiques rapides
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  
  // Boîtes de statistiques
  const startY = 50;
  const boxWidth = 40;
  const boxHeight = 20;
  
  // Boîte revenus
  doc.setFillColor(greenColor[0], greenColor[1], greenColor[2]); // Vert
  doc.rect(20, startY, boxWidth, boxHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("REVENUS", 22, startY + 6);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalIncome.toLocaleString()} F`, 22, startY + 12);
  doc.text("CFA", 22, startY + 17);
  
  // Boîte dépenses
  doc.setFillColor(redColor[0], redColor[1], redColor[2]); // Rouge
  doc.rect(70, startY, boxWidth, boxHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("DÉPENSES", 72, startY + 6);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalExpense.toLocaleString()} F`, 72, startY + 12);
  doc.text("CFA", 72, startY + 17);
  
  // Boîte solde
  const balanceColor: [number, number, number] = balance >= 0 ? greenColor : redColor;
  doc.setFillColor(balanceColor[0], balanceColor[1], balanceColor[2]);
  doc.rect(120, startY, boxWidth, boxHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("SOLDE", 122, startY + 6);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${balance.toLocaleString()} F`, 122, startY + 12);
  doc.text("CFA", 122, startY + 17);
  
  // Format data for the table
  const tableData = transactions.map(t => {
    const date = format(new Date(t.date), "dd/MM/yyyy");
    return [
      date,
      t.description,
      t.category,
      t.type === "income" ? "Revenu" : "Dépense",
      `${t.amount.toLocaleString()} F CFA`
    ];
  });
  
  // Table avec style amélioré
  autoTable(doc, {
    startY: startY + 30,
    head: [["Date", "Description", "Catégorie", "Type", "Montant"]],
    body: tableData,
    theme: "grid",
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: { 
      fontSize: 9,
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: lightGray
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 25 },
      1: { halign: "left", cellWidth: 60 },
      2: { halign: "center", cellWidth: 30 },
      3: { halign: "center", cellWidth: 25 },
      4: { halign: "right", cellWidth: 35 }
    },
    margin: { left: 20, right: 20 }
  });

  // Résumé final
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Encadré de résumé
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, finalY, 170, 35, 'F');
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(20, finalY, 170, 35, 'S');
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RÉSUMÉ FINANCIER", 25, finalY + 8);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre de transactions: ${transactions.length}`, 25, finalY + 16);
  doc.text(`Total des revenus: ${totalIncome.toLocaleString()} F CFA`, 25, finalY + 22);
  doc.text(`Total des dépenses: ${totalExpense.toLocaleString()} F CFA`, 25, finalY + 28);
  
  // Solde final avec couleur
  doc.setFont("helvetica", "bold");
  const finalBalanceColor = balance >= 0 ? greenColor : redColor;
  doc.setTextColor(finalBalanceColor[0], finalBalanceColor[1], finalBalanceColor[2]);
  doc.text(`Solde final: ${balance.toLocaleString()} F CFA`, 120, finalY + 22);
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.height;
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text("Document généré automatiquement par le système de gestion", 105, pageHeight - 15, { align: "center" });
  doc.text(`Page 1 - ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 105, pageHeight - 10, { align: "center" });
  
  return doc;
};

// Fonction pour prévisualiser le PDF
export const previewPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): void => {
  console.log("Création de l'aperçu PDF...");
  try {
    const doc = createPDF(transactions, title);
    
    // Ouvrir l'aperçu dans une nouvelle fenêtre
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
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
            <iframe src="${pdfUrl}" type="application/pdf"></iframe>
            <script>
              function downloadPDF() {
                const link = document.createElement('a');
                link.href = '${pdfUrl}';
                link.download = '${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf';
                link.click();
              }
              
              function printPDF() {
                const iframe = document.querySelector('iframe');
                iframe.contentWindow.print();
              }
            </script>
          </body>
        </html>
      `);
    } else {
      // Fallback si le popup est bloqué
      window.open(pdfUrl, '_blank');
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'aperçu PDF:", error);
  }
};

// Fonction d'exportation directe
export const exportTransactionsToPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): void => {
  console.log("Export PDF en cours...");
  try {
    const doc = createPDF(transactions, title);
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    doc.save(fileName);
    console.log("PDF exporté avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
  }
};

// Fonction d'impression directe
export const printTransactionsPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
): void => {
  console.log("Impression PDF en cours...");
  try {
    const doc = createPDF(transactions, title);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
    console.log("PDF envoyé à l'impression!");
  } catch (error) {
    console.error("Erreur lors de l'impression PDF:", error);
  }
};
