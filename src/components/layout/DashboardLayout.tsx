
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { toast } from "sonner";

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
      
      if (savedPrimaryColor || savedAccentColor || savedSecondaryColor) {
        // Déclencher un reflow pour forcer une mise à jour visuelle
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.style.transition = "background-color 0.3s ease";
        }
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={collapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
