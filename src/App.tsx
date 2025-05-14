import { useEffect } from "react";
import { initializeSupabase } from "./utils/supabaseSetup";
import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Layout } from "@/components/Layout"
import { Login } from "@/pages/Login"
import { Employees } from "@/pages/Employees";
import { Products } from "@/pages/Products";
import { Categories } from "@/pages/Categories";
import { Orders } from "@/pages/Orders";
import { Users } from "@/pages/Users";
import { Settings } from "@/pages/Settings";
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
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <div>Dashboard</div>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/employees"
          element={
            isAuthenticated ? (
              <Layout>
                <Employees />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated ? (
              <Layout>
                <Products />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/categories"
          element={
            isAuthenticated ? (
              <Layout>
                <Categories />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated ? (
              <Layout>
                <Orders />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         <Route
          path="/users"
          element={
            isAuthenticated ? (
              <Layout>
                <Users />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <Layout>
                <Settings />
              </Layout>
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
