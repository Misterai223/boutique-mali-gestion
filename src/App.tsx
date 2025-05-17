import { useEffect, useState } from "react";
import { initializeSupabase } from "./utils/supabaseSetup";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginForm from "./components/auth/LoginForm";
import { Employees } from "./pages/Employees";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import { authService } from "./services/authService";
import Finances from "./pages/Finances";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import MediaLibrary from "./pages/MediaLibrary";
import { toast } from "sonner";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialiser les buckets Supabase
    try {
      initializeSupabase();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Supabase:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          await authService.getCurrentUser(); // Récupère et stocke les infos utilisateur
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={() => setIsAuthenticated(true)} />} />
        <Route
          path="/"
          element={
            <Index 
              isAuthenticated={isAuthenticated} 
              onAuthChange={setIsAuthenticated} 
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Dashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/employees"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Employees />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Products />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/categories"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Categories />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Orders />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/inventory"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Inventory />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/finances"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Finances />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Reports />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Users />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Settings />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/media"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <MediaLibrary />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
