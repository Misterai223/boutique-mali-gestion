
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

interface MonthlyGoalSectionProps {
  salesProgress: number;
  inView: boolean;
}

const MonthlyGoalSection = ({ salesProgress, inView }: MonthlyGoalSectionProps) => {
  const breakpoint = useBreakpoint();
  
  // Ajuster les tailles de texte et espacements en fonction de l'écran
  const getTitleSize = () => {
    if (breakpoint === 'xs' || breakpoint === 'sm') return 'text-lg';
    if (breakpoint === 'md') return 'text-xl';
    return 'text-2xl';
  };
  
  const getTextSize = () => {
    if (breakpoint === 'xs') return 'text-xs';
    if (breakpoint === 'sm') return 'text-sm';
    return 'text-base';
  };
  
  const getProgressHeight = () => {
    if (breakpoint === 'xs') return 'h-1.5';
    if (breakpoint === 'sm' || breakpoint === 'md') return 'h-2';
    return 'h-3';
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full"
    >
      <Card className="border-none shadow-lg bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className={`${getTitleSize()} font-bold`}>Objectif mensuel</CardTitle>
          <CardDescription className={getTextSize()}>
            Progression vers l'objectif de ventes du mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className={`${getTextSize()} font-medium`}>
                Ventes actuelles: 8,500,000 F CFA
              </span>
              <span className={`${getTextSize()} font-semibold text-primary`}>
                {salesProgress}%
              </span>
            </div>
            <Progress value={salesProgress} className={getProgressHeight()} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">
                Objectif: 10,000,000 F CFA
              </span>
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Sur la bonne voie
                </span>
                <span className="text-muted-foreground">
                  (Restant: 1,500,000 F CFA)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyGoalSection;
