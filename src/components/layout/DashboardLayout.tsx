
import { useState } from "react";
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
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={collapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          toggleSidebar={toggleSidebar} 
          collapsed={collapsed}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
