
import { Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect } from "react";
import { authService } from "@/services/authService";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  children: React.ReactNode;
}

const ProtectedRoute = ({ 
  isAuthenticated, 
  onLogout, 
  children 
}: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Effet pour vérifier la validité de la session
  useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated) {
        const session = await authService.getSession();
        if (!session) {
          console.log("ProtectedRoute - Session invalide détectée, déconnexion");
          onLogout();
        }
      }
    };
    
    checkSession();
  }, [isAuthenticated, onLogout]);
  
  if (!isAuthenticated) {
    console.log(`ProtectedRoute - Accès refusé à ${location.pathname}`);
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout onLogout={onLogout}>
      {children}
    </DashboardLayout>
  );
};

export default ProtectedRoute;
