
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
  const [hasChecked, setHasChecked] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  // Effet pour éviter les boucles infinies de rendu
  useEffect(() => {
    // Délai court pour laisser le temps aux autres états de se stabiliser
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log("ProtectedRoute - User non authentifié, préparation redirection");
        setRedirectToLogin(true);
      }
      setHasChecked(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  // Afficher un écran de chargement pendant la vérification initiale
  if (!hasChecked) {
    return <LoadingScreen message="Vérification de l'authentification..." />;
  }
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (redirectToLogin) {
    console.log("ProtectedRoute - User non authentifié, redirection vers /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si les permissions sont en cours de chargement, afficher un indicateur de chargement
  if (permissionsLoading) {
    return (
      <DashboardLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  try {
    // Vérifier si l'utilisateur a accès à cette route
    // Les utilisateurs ajoutés via Supabase auth sont automatiquement considérés comme administrateurs
    if (!isAdmin && !hasAccess(location.pathname)) {
      console.log("ProtectedRoute - Accès refusé à", location.pathname);
      return <Navigate to="/" replace />;
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
