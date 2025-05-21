
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
