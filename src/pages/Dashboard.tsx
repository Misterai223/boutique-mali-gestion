
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewSection from "@/components/dashboard/OverviewSection";
import StatsSection from "@/components/dashboard/StatsSection";
import MonthlyGoalSection from "@/components/dashboard/MonthlyGoalSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import TablesSection from "@/components/dashboard/TablesSection";
import { startOfWeek, endOfWeek, isWithinInterval, isBefore, isAfter, addDays } from "date-fns";

const Dashboard = () => {
  // État pour la date actuelle et les filtres
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWeekSelected, setIsWeekSelected] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined);
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

  // Fonction pour déterminer si des données doivent être filtrées
  const shouldFilterData = (date: Date): boolean => {
    if (isWeekSelected) {
      return isWithinInterval(date, { start: weekStart, end: weekEnd });
    }
    
    if (dateRange?.from && dateRange?.to) {
      return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
    }
    
    return true; // Aucun filtre actif
  };

  // Fonction pour charger les données (simulation)
  const loadData = () => {
    setLoading(true);
    
    // Réinitialiser les compteurs pour l'animation
    setSalesProgress(0);
    setConversionRate(0);
    
    setTimeout(() => {
      // Si filtre par semaine ou plage de dates
      if (isWeekSelected || (dateRange?.from && dateRange?.to)) {
        // Exemple : données différentes pour une période spécifique
        const rangeSize = dateRange 
          ? Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) 
          : 7;
        
        const dailyAverage = 40000 + Math.random() * 20000;
        const calculatedTotal = Math.round(dailyAverage * rangeSize);
        const formattedTotal = calculatedTotal.toLocaleString('fr-FR');
        
        setSalesData({
          todaySales: Math.round(dailyAverage).toLocaleString('fr-FR'),
          weekSales: (calculatedTotal * 0.75).toLocaleString('fr-FR'),
          monthSales: formattedTotal,
          totalCustomers: Math.round(rangeSize * 20 + Math.random() * 100).toString(),
          avgOrderValue: Math.round(28000 + Math.random() * 8000).toLocaleString('fr-FR'),
          pendingOrders: Math.round(5 + Math.random() * 15).toString()
        });
      } else {
        // Données complètes (sans filtre)
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
        const targetValue = isWeekSelected || dateRange?.from ? 35 + Math.random() * 20 : 85;
        if (prev >= targetValue) {
          clearInterval(progressInterval);
          return targetValue;
        }
        return prev + 5;
      });
    }, 100);
    
    const conversionInterval = setInterval(() => {
      setConversionRate(prev => {
        const targetValue = isWeekSelected || dateRange?.from ? 15 + Math.random() * 10 : 24;
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
  }, [isWeekSelected, dateRange]);

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    loadData();
  };

  // Fonction pour basculer entre les données de la semaine et toutes les données
  const handleSelectWeek = () => {
    setIsWeekSelected(!isWeekSelected);
    setDateRange(undefined); // Réinitialiser la plage de dates personnalisée
    
    // Mettre à jour les dates de début et de fin de semaine
    const now = new Date();
    setWeekStart(startOfWeek(now));
    setWeekEnd(endOfWeek(now));
  };
  
  // Fonction pour gérer le changement de plage de dates
  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      setIsWeekSelected(false); // Désactiver le filtre semaine
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* En-tête avec animations */}
      <DashboardHeader 
        currentTime={currentTime} 
        onRefresh={handleRefresh} 
        onSelectWeek={handleSelectWeek}
        isWeekSelected={isWeekSelected}
        onDateRangeChange={handleDateRangeChange}
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
