
import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentSales from "@/components/dashboard/RecentSales";
import TopProducts from "@/components/dashboard/TopProducts";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import { Package, DollarSign, Users, BarChart4, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  // Simulation d'un chargement de données dynamique
  const [salesProgress, setSalesProgress] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Animation du taux de progression
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

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
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(conversionInterval);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm text-muted-foreground">Dernière mise à jour: Aujourd'hui, 15:30</span>
        </div>
      </div>
      
      {/* Stats Cards avec animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes d'aujourd'hui"
          value="120,000 XOF"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          className="animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        />
        <StatCard
          title="Produits"
          value="145"
          description="12 en rupture de stock"
          icon={Package}
          className="animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        />
        <StatCard
          title="Employés"
          value="8"
          description="2 en congés"
          icon={Users}
          className="animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        />
        <StatCard
          title="Taux de conversion"
          value={`${conversionRate}%`}
          trend={{ value: 5, isPositive: true }}
          icon={BarChart4}
          className="animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      
      {/* Objectif de ventes */}
      <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Objectif mensuel</CardTitle>
          <CardDescription>
            Progression vers l'objectif de ventes du mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ventes actuelles: 8,500,000 XOF</span>
              <span className="text-sm font-medium">{salesProgress}%</span>
            </div>
            <Progress value={salesProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Objectif: 10,000,000 XOF</span>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">Sur la bonne voie</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts and Tables avec un peu d'espace entre eux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <SalesChart />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <TopProducts />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <RecentSales />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <InventoryAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
