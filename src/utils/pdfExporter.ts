
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Extend the jsPDF types for autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportableTransaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

export const exportTransactionsToPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Généré le ${currentDate}`, 14, 30);
  
  // Format data for the table
  const tableData = transactions.map(t => {
    const date = format(new Date(t.date), "dd/MM/yyyy");
    return [
      date,
      t.description,
      t.category,
      t.type === "income" ? "Revenu" : "Dépense",
      `${t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()} F CFA`
    ];
  });
  
  // Define the table structure
  doc.autoTable({
    startY: 40,
    head: [["Date", "Description", "Catégorie", "Type", "Montant"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  
  // Add summary at the bottom
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.text(`Total des revenus: ${totalIncome.toLocaleString()} F CFA`, 14, finalY);
  doc.text(`Total des dépenses: ${totalExpense.toLocaleString()} F CFA`, 14, finalY + 7);
  doc.setFontSize(13);
  doc.text(`Solde: ${balance.toLocaleString()} F CFA`, 14, finalY + 15);
  
  // Save the PDF
  doc.save(`transactions-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const printTransactionsPDF = (
  transactions: ExportableTransaction[],
  title: string = "Rapport des Transactions"
) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Généré le ${currentDate}`, 14, 30);
  
  // Format data for the table
  const tableData = transactions.map(t => {
    const date = format(new Date(t.date), "dd/MM/yyyy");
    return [
      date,
      t.description,
      t.category,
      t.type === "income" ? "Revenu" : "Dépense",
      `${t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()} F CFA`
    ];
  });
  
  // Define the table structure
  doc.autoTable({
    startY: 40,
    head: [["Date", "Description", "Catégorie", "Type", "Montant"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  
  // Add summary at the bottom
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.text(`Total des revenus: ${totalIncome.toLocaleString()} F CFA`, 14, finalY);
  doc.text(`Total des dépenses: ${totalExpense.toLocaleString()} F CFA`, 14, finalY + 7);
  doc.setFontSize(13);
  doc.text(`Solde: ${balance.toLocaleString()} F CFA`, 14, finalY + 15);
  
  // Print the PDF
  doc.autoPrint();
  doc.output('dataurlnewwindow');
};
