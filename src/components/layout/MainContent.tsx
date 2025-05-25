
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  const location = useLocation();
  
  // Calculer l'espacement en fonction de la taille de l'écran
  const getPadding = () => {
    if (breakpoint === 'xs') return 'p-3 sm:p-4';
    if (breakpoint === 'sm') return 'p-4 sm:p-5';
    if (breakpoint === 'md') return 'p-5 sm:p-6';
    return 'p-6 lg:p-8';
  };
  
  // Animations de page
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  
  return (
    <main className={`
      flex-1 overflow-y-auto overflow-x-hidden ${getPadding()} 
      bg-gradient-to-br from-background via-background to-muted/20
      relative min-h-full
    `}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="max-w-7xl mx-auto relative z-10 w-full"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-sm bg-background/30 rounded-2xl p-1 shadow-sm border border-border/20"
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-lg">
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default MainContent;
