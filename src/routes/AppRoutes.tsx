
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "@/components/access/RoleProtectedRoute";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "@/pages/Dashboard";
import { Employees } from "@/pages/Employees";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Inventory from "@/pages/Inventory";
import Finances from "@/pages/Finances";
import Reports from "@/pages/Reports";
import MediaLibrary from "@/pages/MediaLibrary";
import Clients from "@/pages/Clients";
import UserManagement from "@/pages/UserManagement";
import Settings from "@/pages/Settings";

interface AppRoutesProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const AppRoutes = ({ isAuthenticated, onLogin, onLogout }: AppRoutesProps) => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginForm onLogin={onLogin} />
        } 
      />
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="dashboard">
              <Dashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="employees">
              <Employees />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="products">
              <Products />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="categories">
              <Categories />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="inventory">
              <Inventory />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finances"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="finances">
              <Finances />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="reports">
              <Reports />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="clients">
              <Clients />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="user-management">
              <UserManagement />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="settings">
              <Settings />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/media"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <RoleProtectedRoute requiredPage="media">
              <MediaLibrary />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
