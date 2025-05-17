
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Calendar, Download, Filter, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AddTransactionForm from "./AddTransactionForm";
import { exportTransactionsToPDF, printTransactionsPDF } from "@/utils/pdfExporter";

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
};

const defaultTransactions: Transaction[] = [
  {
    id: 1,
    description: "Vente de téléphones",
    amount: 250000,
    type: "income",
    date: "2023-05-10",
    category: "Ventes",
  },
  {
    id: 2,
    description: "Paiement du loyer",
    amount: 100000,
    type: "expense",
    date: "2023-05-09",
    category: "Loyer",
  },
  {
    id: 3,
    description: "Salaires des employés",
    amount: 150000,
    type: "expense",
    date: "2023-05-08",
    category: "Salaires",
  },
  {
    id: 4,
    description: "Vente d'accessoires",
    amount: 75000,
    type: "income",
    date: "2023-05-07",
    category: "Ventes",
  },
  {
    id: 5,
    description: "Paiement d'électricité",
    amount: 35000,
    type: "expense",
    date: "2023-05-06",
    category: "Charges",
  },
];

interface TransactionListProps {
  onAddTransactionClick?: () => void;
  onExportPDFClick?: () => void;
}

const TransactionList = ({ onAddTransactionClick, onExportPDFClick }: TransactionListProps) => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  
  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique categories
  const categories = [...new Set(transactions.map(t => t.category))];
  
  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter !== "all" && transaction.type !== filter) return false;
    if (categoryFilter && transaction.category !== categoryFilter) return false;
    return true;
  });

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleExportPDF = () => {
    exportTransactionsToPDF(filteredTransactions);
  };

  const handlePrintPDF = () => {
    printTransactionsPDF(filteredTransactions);
  };

  const handleAddTransactionClick = () => {
    if (onAddTransactionClick) {
      onAddTransactionClick();
    } else {
      setIsAddTransactionOpen(true);
    }
  };

  const handleExportPDFClick = () => {
    if (onExportPDFClick) {
      onExportPDFClick();
    } else {
      handleExportPDF();
    }
  };

  return (
    <>
      <Card className="border shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>
              Un aperçu de vos dernières transactions financières
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Type de transaction</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilter("all")} className={filter === "all" ? "bg-accent/50" : ""}>
                  Toutes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("income")} className={filter === "income" ? "bg-accent/50" : ""}>
                  Revenus
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("expense")} className={filter === "expense" ? "bg-accent/50" : ""}>
                  Dépenses
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Catégorie</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setCategoryFilter(null)} className={categoryFilter === null ? "bg-accent/50" : ""}>
                  Toutes
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => setCategoryFilter(category)}
                    className={categoryFilter === category ? "bg-accent/50" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune transaction correspondant aux critères de filtre
              </div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div 
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          transaction.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        )}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDown className="h-5 w-5" />
                        ) : (
                          <ArrowUp className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="rounded-full font-normal">
                            {transaction.category}
                          </Badge>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "font-bold text-base",
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toLocaleString()} F CFA
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleAddTransactionClick}>
              Ajouter une transaction
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrintPDF}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" onClick={handleExportPDFClick}>
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <AddTransactionForm 
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onAddTransaction={handleAddTransaction}
      />
    </>
  );
};

export default TransactionList;
