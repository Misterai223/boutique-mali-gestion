
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import TopNav from "./TopNav";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

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
  
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"}`}>
        <Sidebar className={collapsed ? "w-20" : "w-64"} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
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
      </div>
    </div>
  );
};

export default DashboardLayout;
