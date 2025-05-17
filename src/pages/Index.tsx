
import { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "./Dashboard";
import LoadingScreen from "@/components/layout/LoadingScreen";

const Index = ({ 
  isAuthenticated, 
  onAuthChange 
}: { 
  isAuthenticated: boolean; 
  onAuthChange: (value: boolean) => void;
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("Index composant monté, isAuthenticated:", isAuthenticated);
    
    // Gestion du thème au chargement
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, [isAuthenticated]);
  
  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  const handleLogout = () => {
    console.log("Index - handleLogout appelé");
    onAuthChange(false);
  };
  
  if (!mounted) {
    return <LoadingScreen />;
  }
  
  // Si l'utilisateur est authentifié, rediriger vers le tableau de bord
  // Mais ne pas utiliser le DashboardLayout ici car il est déjà utilisé dans ProtectedRoute
  if (isAuthenticated) {
    console.log("Index - User authentifié, redirection vers le dashboard");
    // Ne pas rendre directement le dashboard ici pour éviter les duplications de layout
    return <Dashboard />;
  }
  
  // Sinon, afficher le formulaire de login
  console.log("Index - User non authentifié, affichage du login");
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
