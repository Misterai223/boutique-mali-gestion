
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, CircleDashed, PlusCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const alerts = [
  {
    id: 1,
    name: "Téléphone Samsung A52",
    status: "low",
    quantity: 3,
    threshold: 5,
    price: "120,000 XOF",
  },
  {
    id: 2,
    name: "iPhone 13",
    status: "out",
    quantity: 0,
    threshold: 3,
    price: "450,000 XOF",
  },
  {
    id: 3,
    name: "Écouteurs Bluetooth",
    status: "low",
    quantity: 5,
    threshold: 10,
    price: "15,000 XOF",
  },
  {
    id: 4,
    name: "Câble USB-C",
    status: "low",
    quantity: 4,
    threshold: 20,
    price: "2,500 XOF",
  },
];

const InventoryAlerts = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-none shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="bg-gradient-to-r from-red-500/5 to-transparent dark:from-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <CardTitle className="text-xl font-bold">Alertes de stock</CardTitle>
                <CardDescription className="text-base mt-1">
                  {alerts.length} produits à réapprovisionner
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Commander
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <CircleDashed className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Vérification du stock...</span>
            </div>
          ) : (
            <motion.div 
              className="divide-y"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  variants={item}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${
                      alert.status === 'out' 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{alert.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          Prix: {alert.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Seuil: {alert.threshold} unités
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={alert.status === "out" ? "destructive" : "outline"} className="ml-auto">
                      {alert.status === "out" ? "Rupture" : "Stock bas"}
                    </Badge>
                    <p className={`text-sm font-medium ${
                      alert.status === 'out' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {alert.quantity} unités
                    </p>
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

export default InventoryAlerts;
