
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
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
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import Users from "./pages/Users";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);
    
    // Appliquer le thème enregistré au chargement initial
    const applyTheme = () => {
      // Récupérer et appliquer le réglage du mode sombre
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      document.documentElement.classList.toggle("dark", savedDarkMode);
      
      // Appliquer les variables CSS enregistrées pour les couleurs du thème
      const savedPrimaryColor = localStorage.getItem("primaryColor");
      const savedAccentColor = localStorage.getItem("accentColor");
      const savedSecondaryColor = localStorage.getItem("secondaryColor");
      const savedBorderRadius = localStorage.getItem("borderRadius");
      const savedFontFamily = localStorage.getItem("fontFamily");
      
      if (savedPrimaryColor || savedAccentColor || savedSecondaryColor) {
        const root = document.documentElement;
        
        const hexToHSL = (hex: string) => {
          // Supprimer le # s'il est présent
          hex = hex.replace(/^#/, '');
          
          // Analyser les valeurs hexadécimales
          let r = parseInt(hex.substr(0, 2), 16) / 255;
          let g = parseInt(hex.substr(2, 2), 16) / 255;
          let b = parseInt(hex.substr(4, 2), 16) / 255;
          
          // Trouver les valeurs de canal maximum et minimum
          let cmin = Math.min(r, g, b);
          let cmax = Math.max(r, g, b);
          let delta = cmax - cmin;
          let h = 0;
          let s = 0;
          let l = 0;
          
          // Calculer la teinte
          if (delta === 0) {
            h = 0;
          } else if (cmax === r) {
            h = ((g - b) / delta) % 6;
          } else if (cmax === g) {
            h = (b - r) / delta + 2;
          } else {
            h = (r - g) / delta + 4;
          }
          
          h = Math.round(h * 60);
          if (h < 0) h += 360;
          
          // Calculer la luminosité
          l = (cmax + cmin) / 2;
          
          // Calculer la saturation
          s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
          
          // Convertir en pourcentages
          s = +(s * 100).toFixed(1);
          l = +(l * 100).toFixed(1);
          
          return { h, s, l };
        };

        if (savedPrimaryColor) {
          const primaryHSL = hexToHSL(savedPrimaryColor);
          root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
        }
        
        if (savedAccentColor) {
          const accentHSL = hexToHSL(savedAccentColor);
          root.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
        }
        
        if (savedSecondaryColor) {
          const secondaryHSL = hexToHSL(savedSecondaryColor);
          root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
        }
      }
      
      if (savedBorderRadius) {
        document.documentElement.style.setProperty('--radius', `${savedBorderRadius}rem`);
      }
      
      if (savedFontFamily) {
        switch(savedFontFamily) {
          case "Inter": 
            document.documentElement.style.fontFamily = "'Inter', sans-serif";
            break;
          case "Roboto": 
            document.documentElement.style.fontFamily = "'Roboto', sans-serif";
            break;
          case "Poppins": 
            document.documentElement.style.fontFamily = "'Poppins', sans-serif";
            break;
          case "Open Sans": 
            document.documentElement.style.fontFamily = "'Open Sans', sans-serif";
            break;
        }
      }
    };
    
    applyTheme();
  }, []);
  
  if (isAuthenticated === null) {
    // Chargement de l'état d'authentification
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
            
            {/* Routes protégées avec DashboardLayout */}
            {isAuthenticated ? (
              <>
                <Route path="/dashboard" element={
                  <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                    <Dashboard />
                  </DashboardLayout>
                } />
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
                <Route 
                  path="/users" 
                  element={
                    <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                      <Users />
                    </DashboardLayout>
                  } 
                />
              </>
            ) : (
              // Rediriger vers la connexion si non authentifié
              <>
                <Route path="/dashboard" element={<Navigate to="/" />} />
                <Route path="/products" element={<Navigate to="/" />} />
                <Route path="/categories" element={<Navigate to="/" />} />
                <Route path="/inventory" element={<Navigate to="/" />} />
                <Route path="/finances" element={<Navigate to="/" />} />
                <Route path="/employees" element={<Navigate to="/" />} />
                <Route path="/reports" element={<Navigate to="/" />} />
                <Route path="/settings" element={<Navigate to="/" />} />
                <Route path="/users" element={<Navigate to="/" />} />
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
