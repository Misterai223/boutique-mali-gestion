
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Finances from "./pages/Finances";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);
  }, []);
  
  if (isAuthenticated === null) {
    // Still loading authentication state
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Index isAuthenticated={isAuthenticated} onAuthChange={setIsAuthenticated} />
            } />
            
            {/* Protected routes with DashboardLayout */}
            {isAuthenticated ? (
              <>
                <Route 
                  path="/products" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Products />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/categories" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Categories />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/inventory" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Inventory />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/finances" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Finances />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/employees" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Employees />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Reports />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Settings />
                    </DashboardLayout>
                  } 
                />
              </>
            ) : (
              // Redirect to login if not authenticated
              <>
                <Route path="/products" element={<Navigate to="/" />} />
                <Route path="/categories" element={<Navigate to="/" />} />
                <Route path="/inventory" element={<Navigate to="/" />} />
                <Route path="/finances" element={<Navigate to="/" />} />
                <Route path="/employees" element={<Navigate to="/" />} />
                <Route path="/reports" element={<Navigate to="/" />} />
                <Route path="/settings" element={<Navigate to="/" />} />
              </>
            )}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
