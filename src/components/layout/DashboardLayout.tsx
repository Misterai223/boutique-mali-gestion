
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import TopNav from "./TopNav";
import { useThemeEffect } from "@/hooks/useThemeEffect";
import { LogoutHandler } from "./LogoutHandler";
import MainContent from "./MainContent";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar avec gestion améliorée sur mobile */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 md:w-20" : "w-64"
        } ${isMobile ? (collapsed ? "hidden" : "fixed z-30 h-full shadow-xl") : ""}`}
      >
        <Sidebar className={collapsed ? "w-0 md:w-20" : "w-64"} />
      </div>
      
      {/* Contenu principal qui s'adapte */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        !isMobile && !collapsed ? "md:ml-64" : ""
      }`}>
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
        <MainContent>
          {children}
        </MainContent>
      </div>
      
      {/* Overlay pour fermer la sidebar sur mobile */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20" 
          onClick={toggleSidebar}
          aria-label="Fermer le menu"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
