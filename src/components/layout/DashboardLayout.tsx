
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
  // Importation du hook useIsMobile et vérification de sa valeur
  const isMobile = useIsMobile();
  
  // État du sidebar avec la valeur par défaut isMobile
  const [collapsed, setCollapsed] = useState(isMobile || false);
  
  // Gérer les changements de taille d'écran et fermer automatiquement la sidebar sur mobile
  useEffect(() => {
    // Ne pas automatiquement fermer la sidebar quand l'écran change de taille
    // seulement initier l'état au chargement
    if (collapsed !== isMobile) {
      setCollapsed(isMobile);
    }
    
    // Sur mobile, si la sidebar est ouverte, la refermer au scroll
    const handleScroll = () => {
      if (isMobile && !collapsed) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, collapsed]);
  
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
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 md:w-20" : "w-64"
        } ${isMobile && collapsed ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100"}`}
      >
        <Sidebar className={collapsed ? "w-20" : "w-64"} />
      </div>
      
      {/* Contenu principal qui s'adapte */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        !isMobile && !collapsed ? "md:ml-64" : collapsed ? "md:ml-20" : "ml-64"
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
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={toggleSidebar}
          aria-label="Fermer le menu"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
