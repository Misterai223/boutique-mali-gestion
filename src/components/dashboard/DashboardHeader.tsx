
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw, CalendarRange, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardHeaderProps {
  currentTime: Date;
  onRefresh: () => void;
  onSelectWeek: () => void;
  isWeekSelected: boolean;
  onDateRangeChange: (range: { from: Date; to: Date } | undefined) => void;
}

const DashboardHeader = ({ 
  currentTime, 
  onRefresh, 
  onSelectWeek,
  isWeekSelected,
  onDateRangeChange
}: DashboardHeaderProps) => {
  // État pour le sélecteur de date
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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

  // Libellé du bouton de plage de dates
  const dateRangeButtonText = dateRange?.from ? (
    dateRange.to ? (
      <>
        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
      </>
    ) : (
      format(dateRange.from, "dd/MM/yyyy")
    )
  ) : (
    "Sélectionner une période"
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    
    // Animation pendant le rafraîchissement
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Données rafraîchies avec succès");
    }, 800);
  };

  const handleSelectWeek = () => {
    onSelectWeek();
    toast.success(isWeekSelected ? "Affichage de toutes les données" : "Affichage des données de cette semaine");
  };

  // Lorsque la plage de dates change
  const handleDateRangeChange = (range: typeof dateRange) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onDateRangeChange(range);
      setIsDateDialogOpen(false);
      toast.success(`Données filtrées du ${format(range.from, "dd/MM/yyyy")} au ${format(range.to, "dd/MM/yyyy")}`);
    }
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
        className="flex flex-wrap items-center gap-2 mt-2 md:mt-0"
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
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => setIsDateDialogOpen(true)}
        >
          <CalendarRange className="h-4 w-4" />
          <span className="max-w-[140px] truncate">{dateRangeButtonText}</span>
          <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
        
        <Button 
          size="sm" 
          variant="default" 
          className={`flex items-center gap-1 ${isRefreshing ? 'opacity-80' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir'}</span>
        </Button>
      </motion.div>

      {/* Dialog pour sélection de plage de dates */}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sélectionnez une plage de dates</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              locale={fr}
              className="pointer-events-auto"
            />
          </div>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={() => {
                if (dateRange?.from && dateRange?.to) {
                  onDateRangeChange(dateRange);
                  setIsDateDialogOpen(false);
                  toast.success(`Données filtrées du ${format(dateRange.from, "dd/MM/yyyy")} au ${format(dateRange.to, "dd/MM/yyyy")}`);
                } else {
                  toast.error("Veuillez sélectionner une date de début et de fin");
                }
              }}
              disabled={!dateRange?.from || !dateRange?.to}
            >
              Appliquer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DashboardHeader;
