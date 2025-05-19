
import { Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/layout/LoadingScreen";

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
  const { hasAccess, loading: permissionsLoading, isAdmin } = useRolePermissions();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectAttempt, setRedirectAttempt] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Effet pour vérifier l'authentification avec un délai pour éviter les boucles
  useEffect(() => {
    // Court délai pour s'assurer que les états sont stables
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log("ProtectedRoute - Fin de la vérification, authentifié:", isAuthenticated);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  // Limite le nombre de redirections pour éviter les boucles infinies
  useEffect(() => {
    if (!isAuthenticated && !isChecking && redirectAttempt < 1) {
      setRedirectAttempt(prev => prev + 1);
    }
  }, [isAuthenticated, isChecking, redirectAttempt]);

  // Effet pour vérifier l'accès à la route actuelle
  useEffect(() => {
    if (isAuthenticated && !isAdmin && !permissionsLoading) {
      try {
        const hasRouteAccess = hasAccess(location.pathname);
        setAccessDenied(!hasRouteAccess);
      } catch (error) {
        console.error("Erreur lors de la vérification d'accès:", error);
        setAccessDenied(false); // En cas d'erreur, par défaut on n'empêche pas l'accès
      }
    }
  }, [isAuthenticated, isAdmin, permissionsLoading, location.pathname, hasAccess]);
  
  // Pendant la vérification, afficher un écran de chargement
  if (isChecking) {
    return <LoadingScreen message="Vérification des accès..." />;
  }
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (!isAuthenticated && redirectAttempt < 1) {
    console.log("ProtectedRoute - Utilisateur non authentifié, redirection vers /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si les permissions sont en cours de chargement, afficher un loading dans le layout
  if (permissionsLoading) {
    return (
      <DashboardLayout onLogout={onLogout}>
        <LoadingScreen message="Chargement des permissions..." />
      </DashboardLayout>
    );
  }
  
  try {
    // Si l'accès est refusé, rediriger vers le tableau de bord
    if (accessDenied) {
      console.log("ProtectedRoute - Accès refusé à", location.pathname);
      return <Navigate to="/dashboard" replace />;
    }

    // L'utilisateur est authentifié et a accès à la route
    console.log("ProtectedRoute - Accès autorisé à", location.pathname);
    return (
      <DashboardLayout onLogout={onLogout}>
        {children}
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Erreur dans ProtectedRoute:", error);
    return <Navigate to="/login?error=session" replace />;
  }
};

export default ProtectedRoute;
