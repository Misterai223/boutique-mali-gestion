
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
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [loginDisplayed, setLoginDisplayed] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("Index composant monté, isAuthenticated:", isAuthenticated);
    
    // Plus long délai pour éviter les boucles de rendu trop rapides
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasChecked(true);
      console.log("Index - Chargement terminé, authentifié:", isAuthenticated);
    }, 1000);
    
    // Gestion du thème au chargement
    try {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      
      if (savedTheme) {
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      } else if (isDark) {
        document.documentElement.classList.add("dark");
      }
    } catch (error) {
      console.error("Erreur lors de l'application du thème:", error);
    }
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Effet pour limiter le nombre de redirections et éviter les boucles
  useEffect(() => {
    if (hasChecked && isAuthenticated && redirectAttempts < 2) {
      setRedirectAttempts(prev => prev + 1);
    } else if (hasChecked && !isAuthenticated && !loginDisplayed) {
      setLoginDisplayed(true);
    }
  }, [hasChecked, isAuthenticated, redirectAttempts, loginDisplayed]);

  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  // Afficher le loading screen pendant le chargement initial
  if (!mounted || isLoading) {
    return <LoadingScreen message="Initialisation de la page d'accueil..." />;
  }
  
  // Une fois les vérifications terminées, rediriger en fonction de l'état d'authentification
  if (hasChecked) {
    if (isAuthenticated && redirectAttempts < 2) {
      console.log("Index - Utilisateur authentifié, redirection vers /dashboard");
      return <Navigate to="/dashboard" replace />;
    } else if (!isAuthenticated && loginDisplayed) {
      console.log("Index - Utilisateur non authentifié, affichage du login");
      return <LoginForm onLogin={handleLogin} />;
    } else if (redirectAttempts >= 2) {
      console.log("Index - Trop de tentatives de redirection, affichage du login");
      // Afficher le formulaire si trop de redirections pour éviter les boucles
      return <LoginForm onLogin={handleLogin} />;
    }
  }
  
  // Fallback - afficher un écran de chargement en attendant
  return <LoadingScreen message="Vérification de l'authentification..." />;
};

export default Index;
