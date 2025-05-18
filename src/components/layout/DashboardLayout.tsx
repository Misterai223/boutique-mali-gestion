
import React, { useState, useEffect } from "react";
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
  
  // Utiliser le hook de manière sécurisée
  useEffect(() => {
    // Détecter manuellement si c'est mobile en cas d'erreur avec le hook
    const checkMobileView = () => {
      try {
        const isMobile = window.innerWidth < 768;
        setIsMobileView(isMobile);
        if (!collapsed && isMobile) {
          setCollapsed(true);
        }
      } catch (e) {
        console.error("Erreur lors de la détection du mode mobile:", e);
      }
    };
    
    // Vérifier immédiatement
    checkMobileView();
    
    // Ajouter l'écouteur pour les changements de taille
    window.addEventListener("resize", checkMobileView);
    
    // Nettoyage
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, [collapsed]);
  
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
