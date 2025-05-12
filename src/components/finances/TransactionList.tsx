
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
};

const transactions: Transaction[] = [
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

const TransactionList = () => {
  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transactions récentes</CardTitle>
          <CardDescription>
            Un aperçu de vos dernières transactions financières
          </CardDescription>
        </div>
        <Button size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Filtrer par date
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-md border"
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
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "font-bold",
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount.toLocaleString()} XOF
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
