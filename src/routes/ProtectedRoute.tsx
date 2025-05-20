
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const { hasAccess, loading: permissionsLoading, isAdmin, isSessionActive } = useRolePermissions();
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Vérifier si l'utilisateur est authentifié et a une session valide
  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        
        // Si l'état local indique authentifié mais pas de session réelle
        if (isAuthenticated && !hasSession) {
          toast.error("Session expirée, reconnexion nécessaire");
          onLogout();
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
        setIsChecking(false);
      }
    };
    
    verifySession();
  }, [isAuthenticated, onLogout]);
  
  // Vérifier les permissions d'accès
  useEffect(() => {
    if (isAuthenticated && !permissionsLoading) {
      const hasRouteAccess = hasAccess(location.pathname);
      setAccessDenied(!hasRouteAccess);
      
      if (!hasRouteAccess) {
        console.log("ProtectedRoute - Accès refusé à", location.pathname);
      }
    }
  }, [isAuthenticated, permissionsLoading, hasAccess, location.pathname]);
  
  // Afficher le chargement pendant les vérifications
  if (isChecking) {
    return <LoadingScreen message="Vérification de l'authentification..." />;
  }
  
  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Afficher le chargement pendant que les permissions sont vérifiées
  if (permissionsLoading) {
    return (
      <DashboardLayout onLogout={onLogout}>
        <LoadingScreen message="Chargement des permissions..." />
      </DashboardLayout>
    );
  }
  
  // Rediriger vers le tableau de bord si l'accès est refusé
  if (accessDenied) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Autoriser l'accès
  return (
    <DashboardLayout onLogout={onLogout}>
      {children}
    </DashboardLayout>
  );
};

export default ProtectedRoute;
