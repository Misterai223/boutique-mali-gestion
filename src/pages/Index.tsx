
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Plus long délai pour éviter les boucles de rendu trop rapides
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasChecked(true);
      console.log("Index - Chargement terminé, authentifié:", isAuthenticated);
    }, 500);
    
    // Gestion du thème au chargement
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (isDark) {
      document.documentElement.classList.add("dark");
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  // Afficher le loading screen pendant le chargement initial
  if (!mounted || isLoading) {
    return <LoadingScreen />;
  }
  
  // Une fois les vérifications terminées, rediriger en fonction de l'état d'authentification
  if (hasChecked) {
    if (isAuthenticated) {
      console.log("Index - Utilisateur authentifié, redirection vers /dashboard");
      return <Navigate to="/dashboard" replace />;
    } else {
      console.log("Index - Utilisateur non authentifié, affichage du login");
      return <LoginForm onLogin={handleLogin} />;
    }
  }
  
  // Fallback - ne devrait jamais être atteint
  return <LoadingScreen />;
};

export default Index;
