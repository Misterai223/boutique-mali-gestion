
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

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
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout onLogout={onLogout}>
      {children}
    </DashboardLayout>
  );
};

export default ProtectedRoute;
