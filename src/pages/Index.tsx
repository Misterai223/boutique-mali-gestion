
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
  const location = useLocation();
  
  useEffect(() => {
    setMounted(true);
    
    // Timing pour éviter les boucles de rendu trop rapides
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
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
  
  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  if (!mounted || isLoading) {
    return <LoadingScreen />;
  }
  
  // Vérification de sécurité pour éviter les redirections en boucle
  // Si l'utilisateur semble authentifié mais a une erreur de session
  // On le garde sur la page d'accueil pour lui permettre de se reconnecter
  try {
    // Si l'utilisateur est authentifié et qu'il est sur la route racine, rediriger vers le dashboard
    // On vérifie le pathname pour éviter une boucle de redirection
    if (isAuthenticated && location.pathname === "/" && !document.location.href.includes("error=session")) {
      console.log("Index - User authentifié, redirection vers /dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    console.error("Erreur lors de la redirection:", error);
    // En cas d'erreur, on reste sur la page de login
    onAuthChange(false);
  }
  
  // Sinon, afficher le formulaire de login
  console.log("Index - User non authentifié, affichage du login");
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
