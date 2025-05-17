
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
  
  useEffect(() => {
    // Auto-collapse sidebar on mobile
    setCollapsed(isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const { handleLogout } = LogoutHandler({ onLogout });
  
  // Appliquer le thème une seule fois au chargement, sans effets secondaires lors de la navigation
  useThemeEffect();
  
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div 
        className={`transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 md:w-20" : "w-64"
        } ${isMobile && !collapsed ? "absolute z-30 h-full shadow-xl" : ""}`}
      >
        <Sidebar className={collapsed ? "w-0 md:w-20" : "w-64"} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
        <MainContent>
          {children}
        </MainContent>
      </div>
      
      {/* Overlay to close sidebar when clicked outside on mobile */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20" 
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
