
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Téléphones", value: 45 },
  { name: "Accessoires", value: 25 },
  { name: "Tablettes", value: 15 },
  { name: "Ordinateurs", value: 10 },
  { name: "Autres", value: 5 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#3b82f6", "#10b981", "#6366f1"];

const TopProducts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produits populaires</CardTitle>
        <CardDescription>
          Répartition des ventes par catégorie
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Pourcentage des ventes']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
