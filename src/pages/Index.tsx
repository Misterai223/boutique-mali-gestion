
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
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
  
  if (!mounted) {
    return <LoadingScreen />;
  }
  
  // Si l'utilisateur est authentifié, rediriger vers le dashboard
  if (isAuthenticated) {
    console.log("Index - User authentifié, redirection vers /dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  // Sinon, afficher le formulaire de login
  console.log("Index - User non authentifié, affichage du login");
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
