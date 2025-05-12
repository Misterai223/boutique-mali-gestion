
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentSales from "@/components/dashboard/RecentSales";
import TopProducts from "@/components/dashboard/TopProducts";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import { Package, DollarSign, Users, BarChart4 } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes d'aujourd'hui"
          value="120,000 XOF"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Produits"
          value="145"
          description="12 en rupture de stock"
          icon={Package}
        />
        <StatCard
          title="Employés"
          value="8"
          description="2 en congés"
          icon={Users}
        />
        <StatCard
          title="Taux de conversion"
          value="24%"
          trend={{ value: 5, isPositive: true }}
          icon={BarChart4}
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart />
        <TopProducts />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales />
        <InventoryAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
