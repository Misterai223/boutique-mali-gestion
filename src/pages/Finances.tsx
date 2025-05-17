
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/finances/TransactionList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { PlusCircle, Download, FileText } from "lucide-react";
import AddTransactionForm from "@/components/finances/AddTransactionForm";
import { exportTransactionsToPDF } from "@/utils/pdfExporter";

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
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const handleAddTransaction = (transaction: any) => {
    // Dans une application réelle, nous ajouterions la transaction à une base de données
    console.log("Nouvelle transaction:", transaction);
    setIsAddTransactionOpen(false);
  };

  const handleExportFinancialData = () => {
    const transformedData = financialData.map((item, index) => ({
      id: index + 1, // Convert to number by using the array index + 1
      description: `Récapitulatif financier - ${item.month}`,
      amount: item.revenus,
      type: "income" as const,
      date: new Date().toISOString().split('T')[0],
      category: "Récapitulatif",
    }));
    
    exportTransactionsToPDF(transformedData, "Récapitulatif Financier");
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportFinancialData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une transaction
          </Button>
        </div>
      </motion.div>

      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 sm:w-[400px]">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Financial Summary */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="stat-card hover:shadow-md transition-shadow">
                <CardHeader className="px-4 py-0 pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Revenus (mois en cours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">1 100 000 F CFA</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="i-lucide-trending-up mr-1"></span>
                    +12% par rapport au mois précédent
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="stat-card hover:shadow-md transition-shadow">
                <CardHeader className="px-4 py-0 pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Dépenses (mois en cours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">600 000 F CFA</p>
                  <p className="text-xs text-red-600 flex items-center">
                    <span className="i-lucide-trending-up mr-1"></span>
                    +9% par rapport au mois précédent
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="stat-card hover:shadow-md transition-shadow">
                <CardHeader className="px-4 py-0 pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Bénéfice net (mois en cours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">500 000 F CFA</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="i-lucide-trending-up mr-1"></span>
                    +5% par rapport au mois précédent
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Financial Chart */}
          <motion.div variants={itemVariants}>
            <Card className="border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Performance financière</CardTitle>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Détails
                </Button>
              </CardHeader>
              <CardContent className="h-[400px]">
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
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} F CFA`]} 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                    />
                    <Legend />
                    <Bar dataKey="revenus" name="Revenus" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="dépenses" name="Dépenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="bénéfice" name="Bénéfice" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TransactionList />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle>Rapports financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                      <div className="text-left">
                        <p className="font-bold">Rapport mensuel</p>
                        <p className="text-sm text-muted-foreground">
                          Résumé détaillé des finances pour le mois en cours
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                      <div className="text-left">
                        <p className="font-bold">Rapport trimestriel</p>
                        <p className="text-sm text-muted-foreground">
                          Analyse des tendances sur les 3 derniers mois
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                      <div className="text-left">
                        <p className="font-bold">Rapport annuel</p>
                        <p className="text-sm text-muted-foreground">
                          Bilan financier complet de l'année
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full flex justify-start p-6 h-auto">
                      <div className="text-left">
                        <p className="font-bold">Rapport personnalisé</p>
                        <p className="text-sm text-muted-foreground">
                          Créer un rapport adapté à vos besoins spécifiques
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <AddTransactionForm 
        open={isAddTransactionOpen} 
        onOpenChange={setIsAddTransactionOpen} 
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default Finances;
