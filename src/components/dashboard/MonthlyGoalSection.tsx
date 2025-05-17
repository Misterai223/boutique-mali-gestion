
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthlyGoalSectionProps {
  salesProgress: number;
  inView: boolean;
}

const MonthlyGoalSection = ({ salesProgress, inView }: MonthlyGoalSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full"
    >
      <Card className="border-none shadow-lg bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">Objectif mensuel</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Progression vers l'objectif de ventes du mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className="text-base sm:text-lg md:text-xl font-medium">
                Ventes actuelles: 8,500,000 F CFA
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold text-primary">
                {salesProgress}%
              </span>
            </div>
            <Progress value={salesProgress} className="h-2 sm:h-2.5 md:h-3" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm md:text-base">
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
