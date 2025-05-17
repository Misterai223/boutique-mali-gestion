
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewSection from "@/components/dashboard/OverviewSection";
import StatsSection from "@/components/dashboard/StatsSection";
import MonthlyGoalSection from "@/components/dashboard/MonthlyGoalSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import TablesSection from "@/components/dashboard/TablesSection";

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

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* En-tête avec animations */}
      <DashboardHeader currentTime={currentTime} />
      
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
