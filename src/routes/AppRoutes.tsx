import { Routes, Route, Navigate } from "react-router-dom";
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
import { useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/layout/LoadingScreen";

interface AppRoutesProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const AppRoutes = ({ isAuthenticated, onLogin, onLogout }: AppRoutesProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [routeInitialized, setRouteInitialized] = useState(false);
  const initAttemptRef = useRef(0);
  
  // Ajouter un délai de chargement plus robuste pour stabiliser l'état d'authentification
  useEffect(() => {
    // Éviter de réinitialiser si déjà initialisé
    if (routeInitialized && !isLoading && appReady) {
      return;
    }
    
    console.log("AppRoutes - Initialisation, tentative:", initAttemptRef.current);
    initAttemptRef.current += 1;
    
    // Limiter les tentatives d'initialisation pour éviter les boucles
    if (initAttemptRef.current > 3) {
      console.log("AppRoutes - Trop de tentatives d'initialisation, on force l'état prêt");
      setIsLoading(false);
      setAppReady(true);
      setRouteInitialized(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Court délai supplémentaire pour stabiliser l'application
      setTimeout(() => {
        setAppReady(true);
        console.log("Application prête, état d'authentification:", isAuthenticated);
        
        // Délai pour marquer les routes comme initialisées
        setTimeout(() => {
          setRouteInitialized(true);
        }, 500);
      }, 500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, routeInitialized, isLoading, appReady]);
  
  // Afficher un écran de chargement initial pour éviter les flashs
  if (isLoading || !appReady) {
    return <LoadingScreen message="Initialisation de l'application..." />;
  }

  return (
    <Routes>
      {/* Route de login avec protection anti-boucle */}
      <Route 
        path="/login" 
        element={
          isAuthenticated && routeInitialized ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginForm onLogin={onLogin} />
        } 
      />
      
      {/* Route d'accueil avec stabilisation */}
      <Route 
        path="/" 
        element={
          <Index 
            isAuthenticated={isAuthenticated} 
            onAuthChange={(value) => value ? onLogin() : onLogout()} 
          />
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
