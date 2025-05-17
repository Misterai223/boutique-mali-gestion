
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Users, ChevronRight, CircleDollarSign } from "lucide-react";
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

interface OverviewSectionProps {
  salesData: {
    todaySales: string;
    weekSales: string;
    monthSales: string;
    totalCustomers: string;
    avgOrderValue: string;
    pendingOrders: string;
  };
  loading: boolean;
  salesProgress: number;
  inView: boolean;
}

const OverviewSection = ({ salesData, loading, salesProgress, inView }: OverviewSectionProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
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
  );
};

export default OverviewSection;
