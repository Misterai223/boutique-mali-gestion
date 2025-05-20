
import { AnimatePresence, motion } from "framer-motion";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main 
      className="flex-1 overflow-y-auto p-4 md:p-6 bg-background"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key="dashboard-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default MainContent;
