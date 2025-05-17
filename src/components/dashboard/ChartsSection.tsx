
import { motion } from "framer-motion";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";

interface ChartsSectionProps {
  inView: boolean;
}

const ChartsSection = ({ inView }: ChartsSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <motion.div 
        className="lg:col-span-2"
        initial={{ x: -50, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SalesChart />
      </motion.div>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <TopProducts />
      </motion.div>
    </motion.div>
  );
};

export default ChartsSection;
