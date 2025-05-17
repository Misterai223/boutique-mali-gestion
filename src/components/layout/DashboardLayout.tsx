
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import TopNav from "./TopNav";
import { toast } from "sonner";
import { motion } from "framer-motion";

const DashboardLayout = ({ 
  children, 
  onLogout 
}: { 
  children: React.ReactNode;
  onLogout: () => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const handleLogout = () => {
    toast.info("Déconnexion en cours...");
    setTimeout(() => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      onLogout();
    }, 500);
  };
  
  // Forcer l'application du thème après le montage
  useEffect(() => {
    const applyThemeToBackground = () => {
      const savedPrimaryColor = localStorage.getItem("primaryColor");
      const savedAccentColor = localStorage.getItem("accentColor");
      const savedSecondaryColor = localStorage.getItem("secondaryColor");
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      
      if (savedPrimaryColor || savedAccentColor || savedSecondaryColor) {
        // Déclencher un reflow pour forcer une mise à jour visuelle
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.style.transition = "background-color 0.3s ease";
        }
        
        const sidebarElement = document.querySelector('aside');
        if (sidebarElement) {
          sidebarElement.style.transition = "background-color 0.3s ease";
        }
        
        // Appliquer la classe dark au documentElement si nécessaire
        document.documentElement.classList.toggle("dark", savedDarkMode);
      }
    };
    
    applyThemeToBackground();
    
    // Observer les changements dans le DOM pour reappliquer le thème si nécessaire
    const observer = new MutationObserver(() => {
      applyThemeToBackground();
    });
    
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  const mainVariants = {
    expanded: { marginLeft: 0, width: collapsed ? "calc(100% - 80px)" : "calc(100% - 256px)" },
    collapsed: { marginLeft: 0, width: "calc(100% - 80px)" }
  };
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar className={collapsed ? "w-20" : "w-64"} collapsed={collapsed} />
      
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden"
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={mainVariants}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      >
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-background"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
