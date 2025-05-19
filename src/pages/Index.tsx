
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    setMounted(true);
    
    // Timing pour éviter les boucles de rendu trop rapides
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    console.log("Index composant monté, isAuthenticated:", isAuthenticated);
    
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
  
  // Limiter le nombre de tentatives de redirection pour éviter les boucles
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setRedirectAttempts(prev => prev + 1);
    }
  }, [isLoading, isAuthenticated]);

  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  if (!mounted || isLoading) {
    return <LoadingScreen />;
  }
  
  // Protection contre les boucles infinies
  if (redirectAttempts > 5) {
    console.log("Index - Trop de tentatives de redirection, affichage du formulaire de login");
    localStorage.removeItem("isAuthenticated");
    onAuthChange(false);
    return <LoginForm onLogin={handleLogin} />;
  }
  
  // Vérification de sécurité pour éviter les redirections en boucle
  try {
    // Vérifier si la redirection est possible et nécessaire
    if (isAuthenticated && location.pathname === "/" && 
        !document.location.href.includes("error=session") && 
        !document.location.href.includes("error=redirect")) {
      
      console.log("Index - User authentifié, redirection vers /dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    console.error("Erreur lors de la redirection:", error);
    // Ajouter un paramètre pour éviter les boucles infinies
    return <Navigate to="/?error=redirect" replace />;
  }
  
  // Sinon, afficher le formulaire de login
  console.log("Index - User non authentifié, affichage du login");
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
