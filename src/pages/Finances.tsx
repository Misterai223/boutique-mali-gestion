
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/finances/TransactionList";
import FinancialDetailsModal from "@/components/finances/FinancialDetailsModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { PlusCircle, Download, FileText, Eye, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import AddTransactionForm from "@/components/finances/AddTransactionForm";
import { exportTransactionsToPDF, previewPDF } from "@/utils/pdfExporter";

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const handleAddTransaction = (transaction: any) => {
    console.log("Nouvelle transaction:", transaction);
    setIsAddTransactionOpen(false);
  };

  const handlePreviewFinancialData = () => {
    const transformedData = financialData.map((item, index) => ({
      id: index + 1,
      description: `Récapitulatif financier - ${item.month}`,
      amount: item.revenus,
      type: "income" as const,
      date: new Date().toISOString().split('T')[0],
      category: "Récapitulatif",
    }));
    
    previewPDF(transformedData, "Récapitulatif Financier");
  };

  const handleExportFinancialData = () => {
    const transformedData = financialData.map((item, index) => ({
      id: index + 1,
      description: `Récapitulatif financier - ${item.month}`,
      amount: item.revenus,
      type: "income" as const,
      date: new Date().toISOString().split('T')[0],
      category: "Récapitulatif",
    }));
    
    exportTransactionsToPDF(transformedData, "Récapitulatif Financier");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="space-y-6 p-4 sm:p-6">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Finances
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos transactions et analysez vos performances financières
            </p>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button variant="outline" onClick={handlePreviewFinancialData} className="hover:shadow-md transition-all duration-200">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu PDF
            </Button>
            <Button variant="outline" onClick={handleExportFinancialData} className="hover:shadow-md transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
            <Button 
              onClick={() => setIsAddTransactionOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une transaction
            </Button>
          </motion.div>
        </motion.div>

        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-[400px] h-12 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                Rapports
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Financial Summary */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                        Revenus (mois en cours)
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">1 100 000 F CFA</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% par rapport au mois précédent
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                        Dépenses (mois en cours)
                      </CardTitle>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300">600 000 F CFA</div>
                      <p className="text-xs text-red-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +9% par rapport au mois précédent
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Bénéfice net (mois en cours)
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">500 000 F CFA</div>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5% par rapport au mois précédent
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Financial Chart */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Performance financière</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Évolution des revenus, dépenses et bénéfices
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDetailsModalOpen(true)}
                    className="hover:bg-accent transition-colors duration-200"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Détails
                  </Button>
                </CardHeader>
                <CardContent className="h-[400px] pt-4">
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
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '1px solid hsl(var(--border))',
                          backgroundColor: 'hsl(var(--card))',
                          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                        }} 
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TransactionList />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Rapports financiers</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Générez des rapports détaillés pour analyser vos performances
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }} 
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent/5 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="font-semibold text-sm truncate">Rapport mensuel</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left leading-relaxed">
                          Résumé détaillé des finances pour le mois en cours
                        </p>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }} 
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent/5 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="font-semibold text-sm truncate">Rapport trimestriel</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left leading-relaxed">
                          Analyse des tendances sur les 3 derniers mois
                        </p>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }} 
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent/5 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="font-semibold text-sm truncate">Rapport annuel</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left leading-relaxed">
                          Bilan financier complet de l'année
                        </p>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }} 
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent/5 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="font-semibold text-sm truncate">Rapport personnalisé</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left leading-relaxed">
                          Créer un rapport adapté à vos besoins spécifiques
                        </p>
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

        <FinancialDetailsModal 
          open={isDetailsModalOpen} 
          onOpenChange={setIsDetailsModalOpen} 
        />
      </div>
    </div>
  );
};

export default Finances;
