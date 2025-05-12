
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/finances/TransactionList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const financialData = [
  {
    month: "Jan",
    revenus: 800000,
    dépenses: 450000,
    bénéfice: 350000,
  },
  {
    month: "Fév",
    revenus: 950000,
    dépenses: 500000,
    bénéfice: 450000,
  },
  {
    month: "Mar",
    revenus: 1000000,
    dépenses: 520000,
    bénéfice: 480000,
  },
  {
    month: "Avr",
    revenus: 1200000,
    dépenses: 550000,
    bénéfice: 650000,
  },
  {
    month: "Mai",
    revenus: 1100000,
    dépenses: 600000,
    bénéfice: 500000,
  },
];

const Finances = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Exporter PDF</Button>
          <Button>Ajouter une transaction</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="stat-card">
              <CardHeader className="px-4 py-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Revenus (mois en cours)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">1,100,000 XOF</p>
                <p className="text-xs text-green-600">+12% par rapport au mois précédent</p>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardHeader className="px-4 py-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Dépenses (mois en cours)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">600,000 XOF</p>
                <p className="text-xs text-red-600">+9% par rapport au mois précédent</p>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardHeader className="px-4 py-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Bénéfice net (mois en cours)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">500,000 XOF</p>
                <p className="text-xs text-green-600">+5% par rapport au mois précédent</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Financial Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance financière</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} XOF`]} />
                  <Legend />
                  <Bar dataKey="revenus" name="Revenus" fill="hsl(var(--primary))" />
                  <Bar dataKey="dépenses" name="Dépenses" fill="hsl(var(--destructive))" />
                  <Bar dataKey="bénéfice" name="Bénéfice" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <TransactionList />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports financiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                  <div className="text-left">
                    <p className="font-bold">Rapport mensuel</p>
                    <p className="text-sm text-muted-foreground">
                      Résumé détaillé des finances pour le mois en cours
                    </p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                  <div className="text-left">
                    <p className="font-bold">Rapport trimestriel</p>
                    <p className="text-sm text-muted-foreground">
                      Analyse des tendances sur les 3 derniers mois
                    </p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                  <div className="text-left">
                    <p className="font-bold">Rapport annuel</p>
                    <p className="text-sm text-muted-foreground">
                      Bilan financier complet de l'année
                    </p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                  <div className="text-left">
                    <p className="font-bold">Rapport personnalisé</p>
                    <p className="text-sm text-muted-foreground">
                      Créer un rapport adapté à vos besoins spécifiques
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
