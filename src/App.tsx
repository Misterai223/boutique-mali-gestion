
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
import Employees from "./pages/Employees";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import { authService } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialiser les buckets Supabase
    initializeSupabase();
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      const session = await authService.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
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
                <div>Dashboard</div>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
