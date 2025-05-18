
import { Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRolePermissions } from "@/hooks/useRolePermissions";

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
  const { hasAccess, loading, isAdmin } = useRolePermissions();
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    console.log("ProtectedRoute - User non authentifié, redirection vers /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si les permissions sont en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return (
      <DashboardLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
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
};

export default ProtectedRoute;
