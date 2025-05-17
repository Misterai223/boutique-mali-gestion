
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";
import { CircleDashed, ArrowUpDown } from "lucide-react";

const data = [
  { name: "Téléphones", value: 45, color: "hsl(var(--primary))" },
  { name: "Accessoires", value: 25, color: "hsl(var(--accent))" },
  { name: "Tablettes", value: 15, color: "#3b82f6" },
  { name: "Ordinateurs", value: 10, color: "#10b981" },
  { name: "Autres", value: 5, color: "#6366f1" },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12} className="dark:fill-white">
        {`${payload.name}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={11} className="dark:fill-gray-400">
        {`${(percent * 100).toFixed(0)}% (${value}%)`}
      </text>
    </g>
  );
};

const TopProducts = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simuler le chargement des données
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  });
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-none shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent dark:from-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Produits populaires</CardTitle>
              <CardDescription className="text-base mt-1">
                Répartition des ventes par catégorie
              </CardDescription>
            </div>
            <button className="rounded-full p-2 hover:bg-muted/50 transition-colors">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] pt-4">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <CircleDashed className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement des données...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      strokeWidth={activeIndex === index ? 2 : 1}
                      stroke={activeIndex === index ? entry.color : "transparent"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopProducts;
