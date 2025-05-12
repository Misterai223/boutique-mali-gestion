
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart4, Calendar, Download } from "lucide-react";

const salesData = [
  {
    name: "Jan",
    Téléphones: 400000,
    Accessoires: 250000,
    Tablettes: 200000,
  },
  {
    name: "Fév",
    Téléphones: 450000,
    Accessoires: 230000,
    Tablettes: 240000,
  },
  {
    name: "Mar",
    Téléphones: 480000,
    Accessoires: 260000,
    Tablettes: 220000,
  },
  {
    name: "Avr",
    Téléphones: 520000,
    Accessoires: 240000,
    Tablettes: 280000,
  },
  {
    name: "Mai",
    Téléphones: 550000,
    Accessoires: 290000,
    Tablettes: 260000,
  },
];

const employeePerformance = [
  {
    name: "Amadou",
    ventes: 520000,
  },
  {
    name: "Fatoumata",
    ventes: 480000,
  },
  {
    name: "Ibrahim",
    ventes: 430000,
  },
  {
    name: "Aminata",
    ventes: 390000,
  },
  {
    name: "Moussa",
    ventes: 320000,
  },
];

const inventoryData = [
  { name: "En stock", value: 70 },
  { name: "Stock bas", value: 20 },
  { name: "Rupture", value: 10 },
];

const COLORS = ["#0088FE", "#FF8042", "#FF0000"];

const Reports = () => {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Sélectionner dates
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
        </TabsList>
        
        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapport des ventes par catégorie</CardTitle>
              <CardDescription>
                Vue d'ensemble des ventes par catégorie pour {period === "week" ? "la semaine" : 
                period === "month" ? "le mois" : 
                period === "quarter" ? "le trimestre" : "l'année"} en cours
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} XOF`]} />
                  <Legend />
                  <Bar dataKey="Téléphones" fill="hsl(var(--primary))" />
                  <Bar dataKey="Accessoires" fill="hsl(var(--accent))" />
                  <Bar dataKey="Tablettes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between w-full">
                <div>
                  <p className="text-sm text-muted-foreground">Total des ventes</p>
                  <p className="text-xl font-bold">4,950,000 XOF</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produit le plus vendu</p>
                  <p className="text-xl font-bold">Téléphones</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Croissance</p>
                  <p className="text-xl font-bold text-green-600">+12%</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>État du stock</CardTitle>
                <CardDescription>
                  Répartition des produits par statut de stock
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="inline-block w-3 h-3 bg-[#0088FE] rounded-full mr-2"></span>
                    En stock: 70% (105 produits)
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-3 h-3 bg-[#FF8042] rounded-full mr-2"></span>
                    Stock bas: 20% (30 produits)
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-3 h-3 bg-[#FF0000] rounded-full mr-2"></span>
                    Rupture: 10% (15 produits)
                  </p>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Produits à réapprovisionner</CardTitle>
                <CardDescription>
                  Liste des produits en rupture ou en stock bas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">iPhone 13</p>
                        <p className="text-sm text-muted-foreground">Téléphones</p>
                      </div>
                      <div className="text-red-600 font-medium text-sm bg-red-50 px-2 py-1 rounded">
                        Rupture
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>0 en stock</span>
                      <span>Seuil: 5</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Samsung Galaxy S21</p>
                        <p className="text-sm text-muted-foreground">Téléphones</p>
                      </div>
                      <div className="text-amber-600 font-medium text-sm bg-amber-50 px-2 py-1 rounded">
                        Stock bas
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>3 en stock</span>
                      <span>Seuil: 5</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Écouteurs Bluetooth</p>
                        <p className="text-sm text-muted-foreground">Accessoires</p>
                      </div>
                      <div className="text-amber-600 font-medium text-sm bg-amber-50 px-2 py-1 rounded">
                        Stock bas
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>5 en stock</span>
                      <span>Seuil: 10</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Voir tous les produits à réapprovisionner (15)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Employees Report */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance des employés</CardTitle>
              <CardDescription>
                Ventes réalisées par employé pour {period === "week" ? "la semaine" : 
                period === "month" ? "le mois" : 
                period === "quarter" ? "le trimestre" : "l'année"} en cours
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={employeePerformance}
                  layout="vertical"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} XOF`, 'Ventes']} />
                  <Legend />
                  <Bar dataKey="ventes" name="Ventes" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between w-full">
                <div>
                  <p className="text-sm text-muted-foreground">Ventes totales</p>
                  <p className="text-xl font-bold">2,140,000 XOF</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meilleur employé</p>
                  <p className="text-xl font-bold">Amadou</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Moyenne par employé</p>
                  <p className="text-xl font-bold">428,000 XOF</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
