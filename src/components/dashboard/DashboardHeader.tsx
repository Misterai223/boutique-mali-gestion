
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  currentTime: Date;
  onDateRangeChange?: (from: Date | null, to: Date | null) => void;
  onRefresh?: () => void;
}

const DashboardHeader = ({ currentTime, onDateRangeChange, onRefresh }: DashboardHeaderProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      // Première sélection ou reset
      const newRange = { from: date, to: null };
      setDateRange(newRange);
      onDateRangeChange?.(date, null);
    } else {
      // Deuxième sélection
      const newRange = {
        from: dateRange.from,
        to: date >= dateRange.from ? date : dateRange.from
      };
      if (date < dateRange.from) {
        newRange.from = date;
        newRange.to = dateRange.from;
      }
      setDateRange(newRange);
      onDateRangeChange?.(newRange.from, newRange.to);
      setIsCalendarOpen(false);
    }
  };

  const handleRefresh = () => {
    console.log('Actualisation des données...');
    onRefresh?.();
  };

  const getDateRangeText = () => {
    if (!dateRange.from) {
      return "Sélectionner une période";
    }
    if (!dateRange.to) {
      return `Du ${format(dateRange.from, "dd MMM yyyy", { locale: fr })}`;
    }
    return `Du ${format(dateRange.from, "dd MMM", { locale: fr })} au ${format(dateRange.to, "dd MMM yyyy", { locale: fr })}`;
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
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 min-w-[200px] justify-start",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <Calendar className="h-4 w-4" />
              <span>{getDateRangeText()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateRange.from || undefined}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
            {dateRange.from && dateRange.to && (
              <div className="p-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDateRange({ from: null, to: null });
                    onDateRangeChange?.(null, null);
                  }}
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        
        <Button 
          size="sm" 
          variant="default" 
          className="flex items-center gap-1"
          onClick={handleRefresh}
        >
          <Activity className="h-4 w-4" />
          <span>Rafraîchir</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHeader;
