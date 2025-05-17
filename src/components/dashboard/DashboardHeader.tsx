
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardHeaderProps {
  currentTime: Date;
  onRefresh: () => void;
  onSelectWeek: () => void;
  isWeekSelected: boolean;
}

const DashboardHeader = ({ 
  currentTime, 
  onRefresh, 
  onSelectWeek,
  isWeekSelected 
}: DashboardHeaderProps) => {
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

  const handleRefresh = () => {
    onRefresh();
    toast.success("Données rafraîchies avec succès");
  };

  const handleSelectWeek = () => {
    onSelectWeek();
    toast.success(isWeekSelected ? "Affichage de toutes les données" : "Affichage des données de cette semaine");
  };

  return (
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
        <Button 
          size="sm" 
          variant={isWeekSelected ? "default" : "outline"} 
          className="flex items-center gap-1"
          onClick={handleSelectWeek}
        >
          <Calendar className="h-4 w-4" />
          <span>Cette semaine</span>
        </Button>
        <Button 
          size="sm" 
          variant="default" 
          className="flex items-center gap-1"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Rafraîchir</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHeader;
