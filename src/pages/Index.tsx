
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom"; 
import LoginForm from "@/components/auth/LoginForm";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";

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
  const [sessionVerified, setSessionVerified] = useState(false);
  const navigate = useNavigate();
  
  // Vérifier la session Supabase au montage pour éviter les redirections incorrectes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        console.log("Index - Vérification de session Supabase:", hasSession ? "Active" : "Inactive");
        
        if (isAuthenticated !== hasSession) {
          console.log("Index - Incohérence détectée entre l'état local et la session Supabase");
          // Synchroniser l'état d'authentification avec la session Supabase
          onAuthChange(hasSession);
        }
        
        setSessionVerified(true);
      } catch (error) {
        console.error("Index - Erreur lors de la vérification de session:", error);
        setSessionVerified(true); // Continuer malgré l'erreur
      }
    };
    
    checkSession();
  }, [isAuthenticated, onAuthChange]);

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
    if (!sessionVerified) return; // Attendre la vérification de session
    
    if (hasChecked && isAuthenticated && redirectAttempts < 2) {
      console.log("Index - Navigation programmée vers /dashboard");
      setRedirectAttempts(prev => prev + 1);
      
      // Utiliser navigate au lieu de redirect pour éviter les problèmes
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    } else if (hasChecked && !isAuthenticated && !loginDisplayed) {
      setLoginDisplayed(true);
    }
  }, [hasChecked, isAuthenticated, redirectAttempts, loginDisplayed, navigate, sessionVerified]);

  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  // Afficher le loading screen pendant le chargement initial
  if (!mounted || isLoading || !sessionVerified) {
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
