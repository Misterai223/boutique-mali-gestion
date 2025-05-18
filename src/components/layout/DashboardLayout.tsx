
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
  // État pour le statut mobile avec valeur par défaut false
  const [isMobileView, setIsMobileView] = useState(false);
  
  // État du sidebar avec la valeur par défaut false
  const [collapsed, setCollapsed] = useState(false);
  
  // Effet pour synchroniser l'état isMobileView avec le hook useIsMobile
  useEffect(() => {
    try {
      // Récupérer la valeur du hook
      const mobileStatus = useIsMobile();
      setIsMobileView(mobileStatus);
      setCollapsed(mobileStatus);
    } catch (e) {
      console.error("Erreur lors de la détection du mode mobile:", e);
    }
  }, []);
  
  // Gérer les changements de taille d'écran et fermer automatiquement la sidebar sur mobile
  useEffect(() => {
    // Ne pas automatiquement fermer la sidebar quand l'écran change de taille
    // seulement initier l'état au chargement
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        setIsMobileView(isMobile);
        
        // Sur mobile, si la sidebar est ouverte, la refermer au redimensionnement
        if (isMobile && !collapsed) {
          setCollapsed(true);
        }
      };
      
      // Vérifier immédiatement
      handleResize();
      
      // Écouter les changements de taille d'écran
      window.addEventListener("resize", handleResize);
      
      // Sur mobile, si la sidebar est ouverte, la refermer au scroll
      const handleScroll = () => {
        if (isMobileView && !collapsed) {
          setCollapsed(true);
        }
      };
      
      window.addEventListener("scroll", handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [collapsed, isMobileView]);
  
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
        } ${isMobileView && collapsed ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100"}`}
      >
        <Sidebar className={collapsed ? "w-20" : "w-64"} />
      </div>
      
      {/* Contenu principal qui s'adapte */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        !isMobileView && !collapsed ? "md:ml-64" : collapsed ? "md:ml-20" : "ml-64"
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
      {isMobileView && !collapsed && (
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
