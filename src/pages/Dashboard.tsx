
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewSection from "@/components/dashboard/OverviewSection";
import StatsSection from "@/components/dashboard/StatsSection";
import MonthlyGoalSection from "@/components/dashboard/MonthlyGoalSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import TablesSection from "@/components/dashboard/TablesSection";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

const Dashboard = () => {
  // État pour la date actuelle et les filtres
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWeekSelected, setIsWeekSelected] = useState(false);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date()));

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
  
  const isMobile = useIsMobile();
  
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

  // Fonction pour charger les données (simulation)
  const loadData = () => {
    setLoading(true);
    
    // Réinitialiser les compteurs pour l'animation
    setSalesProgress(0);
    setConversionRate(0);
    
    setTimeout(() => {
      // Données différentes si le filtre semaine est activé
      if (isWeekSelected) {
        setSalesData({
          todaySales: "40,000",
          weekSales: "325,750",
          monthSales: "3,200,000",
          totalCustomers: "523",
          avgOrderValue: "28,700",
          pendingOrders: "12"
        });
      } else {
        setSalesData({
          todaySales: "120,000",
          weekSales: "785,350",
          monthSales: "8,500,000",
          totalCustomers: "1,257",
          avgOrderValue: "32,500",
          pendingOrders: "23"
        });
      }
      setLoading(false);
    }, 800);

    // Animation du taux de progression
    const progressInterval = setInterval(() => {
      setSalesProgress(prev => {
        const targetValue = isWeekSelected ? 35 : 85;
        if (prev >= targetValue) {
          clearInterval(progressInterval);
          return targetValue;
        }
        return prev + 5;
      });
    }, 100);
    
    const conversionInterval = setInterval(() => {
      setConversionRate(prev => {
        const targetValue = isWeekSelected ? 18 : 24;
        if (prev >= targetValue) {
          clearInterval(conversionInterval);
          return targetValue;
        }
        return prev + 1;
      });
    }, 80);
  };

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Mettre à jour chaque minute
    
    return () => clearInterval(timer);
  }, []);

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, [isWeekSelected]);

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    loadData();
  };

  // Fonction pour basculer entre les données de la semaine et toutes les données
  const handleSelectWeek = () => {
    setIsWeekSelected(!isWeekSelected);
    
    // Mettre à jour les dates de début et de fin de semaine
    const now = new Date();
    setWeekStart(startOfWeek(now));
    setWeekEnd(endOfWeek(now));
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* En-tête avec animations */}
      <DashboardHeader 
        currentTime={currentTime} 
        onRefresh={handleRefresh} 
        onSelectWeek={handleSelectWeek}
        isWeekSelected={isWeekSelected}
      />
      
      {/* Aperçu rapide avec l'heure */}
      <div ref={overviewRef}>
        <OverviewSection 
          salesData={salesData} 
          loading={loading} 
          salesProgress={salesProgress} 
          inView={overviewInView} 
        />
      </div>
      
      {/* Stats Cards avec animation avancée */}
      <div ref={statsRef} className="pt-2">
        <StatsSection conversionRate={conversionRate} inView={statsInView} />
      </div>
      
      {/* Objectif de ventes avec animation au scroll */}
      <div ref={objectifRef}>
        <MonthlyGoalSection salesProgress={salesProgress} inView={objectifInView} />
      </div>
      
      {/* Charts section avec animations */}
      <div ref={chartsRef}>
        <ChartsSection inView={chartsInView} />
      </div>
      
      {/* Tables section avec animations */}
      <div ref={tablesRef}>
        <TablesSection inView={tablesInView} />
      </div>
    </div>
  );
};

export default Dashboard;
