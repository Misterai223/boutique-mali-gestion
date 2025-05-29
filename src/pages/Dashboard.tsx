
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewSection from "@/components/dashboard/OverviewSection";
import StatsSection from "@/components/dashboard/StatsSection";
import MonthlyGoalSection from "@/components/dashboard/MonthlyGoalSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import TablesSection from "@/components/dashboard/TablesSection";

const Dashboard = () => {
  // États existants
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
  
  // Nouvel état pour la plage de dates sélectionnée
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null
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

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Mettre à jour chaque minute
    
    return () => clearInterval(timer);
  }, []);

  // Fonction pour charger les données selon la plage de dates
  const loadDataForDateRange = (from: Date | null, to: Date | null) => {
    setLoading(true);
    
    console.log('Chargement des données pour la période:', {
      from: from?.toLocaleDateString('fr-FR'),
      to: to?.toLocaleDateString('fr-FR')
    });

    // Simulation de chargement avec des données adaptées à la période
    setTimeout(() => {
      const isCustomRange = from && to;
      
      if (isCustomRange) {
        // Données simulées pour la période personnalisée
        const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24));
        const multiplier = Math.max(1, daysDiff / 30); // Adapter selon la durée
        
        setSalesData({
          todaySales: Math.round(120000 * multiplier).toLocaleString(),
          weekSales: Math.round(785350 * multiplier).toLocaleString(),
          monthSales: Math.round(8500000 * multiplier).toLocaleString(),
          totalCustomers: Math.round(1257 * multiplier).toString(),
          avgOrderValue: Math.round(32500 * (1 + multiplier * 0.1)).toLocaleString(),
          pendingOrders: Math.round(23 * multiplier).toString()
        });
        
        setSalesProgress(Math.min(95, 85 + (multiplier * 5)));
        setConversionRate(Math.min(30, 24 + (multiplier * 2)));
        
        toast({
          title: "Données mises à jour",
          description: `Statistiques chargées pour la période du ${from.toLocaleDateString('fr-FR')} au ${to.toLocaleDateString('fr-FR')}`,
        });
      } else {
        // Données par défaut (période actuelle)
        setSalesData({
          todaySales: "120,000",
          weekSales: "785,350",
          monthSales: "8,500,000",
          totalCustomers: "1,257",
          avgOrderValue: "32,500",
          pendingOrders: "23"
        });
        setSalesProgress(85);
        setConversionRate(24);
        
        if (from || to) {
          toast({
            title: "Données par défaut",
            description: "Affichage des statistiques de la période actuelle",
          });
        }
      }
      
      setLoading(false);
    }, 800);
  };

  // Chargement initial des données
  useEffect(() => {
    loadDataForDateRange(null, null);
  }, []);

  // Gestionnaire pour le changement de plage de dates
  const handleDateRangeChange = (from: Date | null, to: Date | null) => {
    setSelectedDateRange({ from, to });
    loadDataForDateRange(from, to);
  };

  // Gestionnaire pour le rafraîchissement
  const handleRefresh = () => {
    toast({
      title: "Actualisation en cours...",
      description: "Mise à jour des données du tableau de bord",
    });
    
    loadDataForDateRange(selectedDateRange.from, selectedDateRange.to);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* En-tête avec sélecteur de dates et bouton rafraîchir */}
      <DashboardHeader 
        currentTime={currentTime}
        onDateRangeChange={handleDateRangeChange}
        onRefresh={handleRefresh}
      />
      
      {/* Aperçu rapide */}
      <div ref={overviewRef}>
        <OverviewSection 
          salesData={salesData} 
          loading={loading} 
          salesProgress={salesProgress} 
          inView={overviewInView} 
        />
      </div>
      
      {/* Stats Cards */}
      <div ref={statsRef} className="pt-2">
        <StatsSection conversionRate={conversionRate} inView={statsInView} />
      </div>
      
      {/* Objectif de ventes */}
      <div ref={objectifRef}>
        <MonthlyGoalSection salesProgress={salesProgress} inView={objectifInView} />
      </div>
      
      {/* Charts section */}
      <div ref={chartsRef}>
        <ChartsSection inView={chartsInView} />
      </div>
      
      {/* Tables section */}
      <div ref={tablesRef}>
        <TablesSection inView={tablesInView} />
      </div>
    </div>
  );
};

export default Dashboard;
