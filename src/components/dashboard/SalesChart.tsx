
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { CircleDashed } from "lucide-react";
import { useState, useEffect } from "react";

// Données de ventes avec un design amélioré
const data = [
  { name: "Lun", ventes: 120000, cible: 140000 },
  { name: "Mar", ventes: 180000, cible: 150000 },
  { name: "Mer", ventes: 150000, cible: 160000 },
  { name: "Jeu", ventes: 190000, cible: 170000 },
  { name: "Ven", ventes: 250000, cible: 180000 },
  { name: "Sam", ventes: 300000, cible: 190000 },
  { name: "Dim", ventes: 200000, cible: 200000 },
];

const SalesChart = () => {
  const isMobile = useIsMobile();
  const [activeData, setActiveData] = useState("week");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatValue = (value: number) => {
    return `${value / 1000}k`;
  };
  
  // Calculer le total des ventes
  const totalSales = data.reduce((sum, item) => sum + item.ventes, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="col-span-2 overflow-hidden border-none shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">Ventes de la semaine</CardTitle>
              <CardDescription className="text-base mt-1">
                Total: {isLoading ? "Chargement..." : `${(totalSales / 1000).toFixed(0)}k XOF`}
              </CardDescription>
            </div>
            
            <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
              <button
                onClick={() => setActiveData("week")}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  activeData === "week" 
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setActiveData("month")}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  activeData === "month" 
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setActiveData("year")}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  activeData === "year" 
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
              >
                Année
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[350px] pt-4">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <CircleDashed className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement des données...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 10,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorCible" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatValue}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={40}
                />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} XOF`, 'Ventes']}
                  labelFormatter={(label) => `Jour: ${label}`}
                  contentStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--background))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventes"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorVentes)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="cible"
                  stroke="hsl(var(--accent))"
                  fillOpacity={0.3}
                  fill="url(#colorCible)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SalesChart;
