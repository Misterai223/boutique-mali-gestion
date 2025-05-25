
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import TopNav from "./TopNav";
import { useThemeEffect } from "@/hooks/useThemeEffect";
import { LogoutHandler } from "./LogoutHandler";
import MainContent from "./MainContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = ({ 
  children, 
  onLogout 
}: { 
  children: React.ReactNode;
  onLogout: () => void;
}) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);
  
  // Gérer les changements de taille d'écran
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const { handleLogout } = LogoutHandler({ onLogout });
  
  // Appliquer le thème au chargement
  useThemeEffect();

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: -280, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Sidebar avec gestion améliorée sur mobile */}
      <AnimatePresence mode="wait">
        {(!isMobile || !collapsed) && (
          <motion.div 
            key="sidebar"
            variants={isMobile ? sidebarVariants : undefined}
            initial={isMobile ? "hidden" : undefined}
            animate={isMobile ? "visible" : undefined}
            exit={isMobile ? "exit" : undefined}
            className={`
              transition-all duration-300 ease-in-out 
              ${collapsed ? "w-0 md:w-20" : "w-64"} 
              ${isMobile ? "fixed z-40 h-full" : "relative"}
            `}
            style={{
              boxShadow: isMobile && !collapsed ? "20px 0 25px -5px rgba(0, 0, 0, 0.1)" : undefined
            }}
          >
            <Sidebar className={collapsed ? "w-0 md:w-20" : "w-64"} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contenu principal qui s'adapte */}
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden min-w-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
        <MainContent>
          {children}
        </MainContent>
      </motion.div>
      
      {/* Overlay pour fermer la sidebar sur mobile */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" 
            onClick={toggleSidebar}
            aria-label="Fermer le menu"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
