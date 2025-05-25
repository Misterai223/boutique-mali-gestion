
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import LoadingScreen from "@/components/layout/LoadingScreen";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredPage: string;
}

const RoleProtectedRoute = ({ children, requiredPage }: RoleProtectedRouteProps) => {
  const { checkPageAccess, loading, userRole } = usePermissions();

  if (loading) {
    return <LoadingScreen />;
  }

  // Vérifier si l'utilisateur a accès à cette page
  if (!checkPageAccess(requiredPage)) {
    console.log(`Accès refusé pour le rôle ${userRole} à la page ${requiredPage}`);
    // Rediriger vers le tableau de bord (page autorisée pour tous)
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
