
import { useEffect, useState, useRef } from "react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentSales from "@/components/dashboard/RecentSales";
import TopProducts from "@/components/dashboard/TopProducts";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import { Package, DollarSign, Users, BarChart4, TrendingUp, Activity, Calendar, Clock, ChevronRight, ChevronDown, CircleDollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 12
    } 
  }
};

const Dashboard = () => {
  // Simulation d'un chargement de données dynamique
  const [salesProgress, setSalesProgress] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    todaySales: "0",
    weekSales: "0",
    monthSales: "0",
    totalCustomers: "0",
    avgOrderValue: "0",
    pendingOrders: "0"
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Refs pour animations basées sur le scroll
  const statsRef = useRef(null);
  const overviewRef = useRef(null);
  const objectifRef = useRef(null);
  const chartsRef = useRef(null);
  const tablesRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const overviewInView = useInView(overviewRef, { once: true, amount: 0.3 });
  const objectifInView = useInView(objectifRef, { once: true, amount: 0.3 });
  const chartsInView = useInView(chartsRef, { once: true, amount: 0.3 });
  const tablesInView = useInView(tablesRef, { once: true, amount: 0.3 });

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Mettre à jour chaque minute
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulation de chargement de données
    const loadData = setTimeout(() => {
      setSalesData({
        todaySales: "120,000",
        weekSales: "785,350",
        monthSales: "8,500,000",
        totalCustomers: "1,257",
        avgOrderValue: "32,500",
        pendingOrders: "23"
      });
      setLoading(false);
    }, 800);

    // Animation du taux de progression
    const progressInterval = setInterval(() => {
      setSalesProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 5;
      });
    }, 100);
    
    const conversionInterval = setInterval(() => {
      setConversionRate(prev => {
        if (prev >= 24) {
          clearInterval(conversionInterval);
          return 24;
        }
        return prev + 1;
      });
    }, 80);

    return () => {
      clearTimeout(loadData);
      clearInterval(progressInterval);
      clearInterval(conversionInterval);
    };
  }, []);

  // Formatter la date actuelle
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);
  
  const formattedTime = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(currentTime);

  return (
    <div className="space-y-8">
      {/* En-tête avec animations */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Tableau de bord
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {formattedDate} • {formattedTime}
          </motion.p>
        </div>
        
        <motion.div 
          className="flex items-center gap-2 mt-2 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Cette semaine</span>
          </Button>
          <Button size="sm" variant="default" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Rafraîchir</span>
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Aperçu rapide avec l'heure - REDESIGNÉ */}
      <motion.div
        ref={overviewRef}
        variants={containerVariants}
        initial="hidden"
        animate={overviewInView ? "visible" : "hidden"}
        className="grid grid-cols-1 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <Clock className="h-5 w-5" /> Aperçu rapide
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 text-base">
                Résumé des performances commerciales
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
                  <div className="h-16 bg-white/10 rounded-md"></div>
                  <div className="h-16 bg-white/10 rounded-md"></div>
                  <div className="h-16 bg-white/10 rounded-md"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-primary-foreground/80">Aujourd'hui</h3>
                      <Badge variant="outline" className="bg-white/20 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" /> +12%
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold mt-2">{salesData.todaySales} F CFA</p>
                    <div className="flex items-center mt-2 text-xs">
                      <CircleDollarSign className="h-3 w-3 mr-1" />
                      <span className="text-primary-foreground/70">
                        {salesData.pendingOrders} commandes en attente
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-primary-foreground/80">Cette semaine</h3>
                      <Badge variant="outline" className="bg-white/20 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" /> +8%
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold mt-2">{salesData.weekSales} F CFA</p>
                    <div className="flex items-center mt-2 text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="text-primary-foreground/70">
                        {salesData.totalCustomers} clients au total
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-primary-foreground/80">Ce mois</h3>
                      <Badge variant="outline" className="bg-white/20 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" /> +15%
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold mt-2">{salesData.monthSales} F CFA</p>
                    <div className="flex items-center mt-2 text-xs">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      <span className="text-primary-foreground/70">
                        Moy. commande: {salesData.avgOrderValue} F CFA
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">Progression vers l'objectif mensuel</span>
                  <span className="text-sm font-medium text-white">{salesProgress}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${salesProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Stats Cards avec animation avancée */}
      <motion.div 
        ref={statsRef}
        variants={containerVariants}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Ventes d'aujourd'hui"
            value="120,000 F CFA"
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
            className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Produits"
            value="145"
            description="12 en rupture de stock"
            icon={Package}
            className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Employés"
            value="8"
            description="2 en congés"
            icon={Users}
            className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Taux de conversion"
            value={`${conversionRate}%`}
            trend={{ value: 5, isPositive: true }}
            icon={BarChart4}
            className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
          />
        </motion.div>
      </motion.div>
      
      {/* Objectif de ventes avec animation au scroll */}
      <motion.div 
        ref={objectifRef}
        initial={{ opacity: 0, y: 30 }}
        animate={objectifInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full"
      >
        <Card className="border-none shadow-lg bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold">Objectif mensuel</CardTitle>
            <CardDescription className="text-base">
              Progression vers l'objectif de ventes du mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <span className="text-lg md:text-xl font-medium">Ventes actuelles: 8,500,000 F CFA</span>
                <span className="text-lg md:text-xl font-semibold text-primary">{salesProgress}%</span>
              </div>
              <Progress value={salesProgress} className="h-2.5 md:h-3" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm md:text-base text-muted-foreground font-medium">Objectif: 10,000,000 F CFA</span>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center text-sm md:text-base text-green-600 dark:text-green-400 font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Sur la bonne voie
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground">
                    (Restant: 1,500,000 F CFA)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Charts section avec animations */}
      <motion.div 
        ref={chartsRef}
        initial={{ opacity: 0 }}
        animate={chartsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div 
          className="lg:col-span-2"
          initial={{ x: -50, opacity: 0 }}
          animate={chartsInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SalesChart />
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={chartsInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TopProducts />
        </motion.div>
      </motion.div>
      
      {/* Tables section avec animations */}
      <motion.div 
        ref={tablesRef}
        initial={{ opacity: 0, y: 30 }}
        animate={tablesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={tablesInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecentSales />
        </motion.div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={tablesInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <InventoryAlerts />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
