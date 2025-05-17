
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleDashed, ArrowUpDown, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-none shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Ventes récentes</CardTitle>
              <CardDescription className="text-base mt-1">
                Vous avez fait 12 ventes aujourd'hui
              </CardDescription>
            </div>
            <button className="rounded-full p-2 hover:bg-muted/50 transition-colors">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <CircleDashed className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement des ventes...</span>
            </div>
          ) : (
            <motion.div 
              className="divide-y"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {sales.map((sale) => (
                <motion.div 
                  key={sale.id} 
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  variants={item}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="border-2 border-primary/20">
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full">
                        {sale.customer.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sale.customer}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {sale.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{sale.amount}</span>
                    <Badge 
                      variant={sale.status === "Terminé" ? "default" : "outline"}
                      className={
                        sale.status === "Terminé" 
                          ? "bg-green-600 hover:bg-green-700 flex items-center gap-1"
                          : "flex items-center gap-1"
                      }
                    >
                      {sale.status === "Terminé" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {sale.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentSales;
