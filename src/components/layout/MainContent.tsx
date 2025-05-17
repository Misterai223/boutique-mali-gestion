
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
  // Calculer l'espacement en fonction de la taille de l'écran
  const getPadding = () => {
    if (breakpoint === 'xs') return 'p-2 pb-16';
    if (breakpoint === 'sm') return 'p-3 pb-16';
    if (breakpoint === 'md') return 'p-4';
    return 'p-6';
  };
  
  return (
    <main 
      className={`flex-1 overflow-y-auto ${getPadding()} bg-background`}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key="dashboard-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default MainContent;
