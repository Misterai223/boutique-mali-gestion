
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

const sales = [
  {
    id: 1,
    customer: "Amadou Diallo",
    amount: "25,000 XOF",
    date: "Il y a 2 heures",
    status: "Terminé",
  },
  {
    id: 2,
    customer: "Fatoumata Touré",
    amount: "18,500 XOF",
    date: "Il y a 3 heures",
    status: "Terminé",
  },
  {
    id: 3,
    customer: "Modibo Keita",
    amount: "32,000 XOF",
    date: "Il y a 5 heures",
    status: "Terminé",
  },
  {
    id: 4,
    customer: "Aminata Traoré",
    amount: "12,000 XOF",
    date: "Aujourd'hui",
    status: "En cours",
  },
  {
    id: 5,
    customer: "Ibrahim Coulibaly",
    amount: "45,000 XOF",
    date: "Hier",
    status: "Terminé",
  },
];

const RecentSales = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes récentes</CardTitle>
        <CardDescription>
          Vous avez fait 12 ventes aujourd'hui
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground rounded-full">
                    {sale.customer.charAt(0)}
                  </div>
                </Avatar>
                <div>
                  <p className="font-medium">{sale.customer}</p>
                  <p className="text-sm text-muted-foreground">{sale.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{sale.amount}</span>
                <span className="rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs">
                  {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
