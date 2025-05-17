
import { motion } from "framer-motion";
import RecentSales from "@/components/dashboard/RecentSales";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";

interface TablesSectionProps {
  inView: boolean;
}

const TablesSection = ({ inView }: TablesSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <RecentSales />
      </motion.div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <InventoryAlerts />
      </motion.div>
    </motion.div>
  );
};

export default TablesSection;
