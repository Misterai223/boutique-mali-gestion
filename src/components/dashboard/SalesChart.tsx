
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";

const data = [
  { name: 'Lun', ventes: 120000 },
  { name: 'Mar', ventes: 180000 },
  { name: 'Mer', ventes: 150000 },
  { name: 'Jeu', ventes: 190000 },
  { name: 'Ven', ventes: 250000 },
  { name: 'Sam', ventes: 300000 },
  { name: 'Dim', ventes: 200000 },
];

const SalesChart = () => {
  const isMobile = useIsMobile();

  const formatValue = (value: number) => {
    return `${value / 1000}k`;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Ventes de la semaine</CardTitle>
        <CardDescription>
          Total: 1,390,000 XOF
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
            />
            <Line
              type="monotone"
              dataKey="ventes"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
