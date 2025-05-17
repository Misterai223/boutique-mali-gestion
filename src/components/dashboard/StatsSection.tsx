
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import { DollarSign, Package, Users, BarChart4 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface StatsSectionProps {
  conversionRate: number;
  inView: boolean;
}

const StatsSection = ({ conversionRate, inView }: StatsSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      <motion.div variants={itemVariants}>
        <StatCard
          title="Ventes d'aujourd'hui"
          value="120,000 F CFA"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatCard
          title="Produits"
          value="145"
          description="12 en rupture de stock"
          icon={Package}
          className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatCard
          title="Employés"
          value="8"
          description="2 en congés"
          icon={Users}
          className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatCard
          title="Taux de conversion"
          value={`${conversionRate}%`}
          trend={{ value: 5, isPositive: true }}
          icon={BarChart4}
          className="shadow-md hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
        />
      </motion.div>
    </motion.div>
  );
};

export default StatsSection;
