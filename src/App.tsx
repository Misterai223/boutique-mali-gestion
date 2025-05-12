
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Finances from "./pages/Finances";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";

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
            <Route path="/" element={<Index isAuthenticated={isAuthenticated} onAuthChange={setIsAuthenticated} />} />
            <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/" />} />
            <Route path="/categories" element={isAuthenticated ? <Categories /> : <Navigate to="/" />} />
            <Route path="/finances" element={isAuthenticated ? <Finances /> : <Navigate to="/" />} />
            <Route path="/employees" element={isAuthenticated ? <Employees /> : <Navigate to="/" />} />
            <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
