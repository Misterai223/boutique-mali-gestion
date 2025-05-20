
import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import ProtectedRoute from "./ProtectedRoute";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "@/pages/Dashboard";
import { Employees } from "@/pages/Employees";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Inventory from "@/pages/Inventory";
import Finances from "@/pages/Finances";
import Reports from "@/pages/Reports";
import MediaLibrary from "@/pages/MediaLibrary";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import Clients from "@/pages/Clients";
import Index from "@/pages/Index";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/layout/LoadingScreen";

interface AppRoutesProps {
  isAuthenticated: boolean;
  onLogin: (session: Session) => void;
  onLogout: () => void;
  session: Session | null;
}

const AppRoutes = ({ isAuthenticated, onLogin, onLogout, session }: AppRoutesProps) => {
  const [isReady, setIsReady] = useState(false);
  
  // Ajouter un délai minimal pour s'assurer que tous les états sont stabilisés
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Afficher un écran de chargement pendant la stabilisation des états
  if (!isReady) {
    return <LoadingScreen message="Préparation des routes..." />;
  }

  return (
    <Routes>
      {/* Route d'accueil avec gestion de la redirection */}
      <Route 
        path="/" 
        element={
          <Index 
            isAuthenticated={isAuthenticated} 
            onAuthChange={(value) => value && session ? onLogin(session) : onLogout()} 
          />
        } 
      />
      
      {/* Route de login avec protection anti-boucle */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginForm onLogin={() => session && onLogin(session)} />
        } 
      />

      {/* Routes protégées avec le DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finances"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Finances />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/media"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <MediaLibrary />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
