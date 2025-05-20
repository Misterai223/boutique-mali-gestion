
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; 
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
  const [isLoading, setIsLoading] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false);
  
  // Vérifier la session Supabase pour s'assurer que l'état local est correct
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        
        if (isAuthenticated !== hasSession) {
          // Synchroniser l'état d'authentification avec la session Supabase
          console.log("Index - Mise à jour de l'état d'authentification:", hasSession);
          onAuthChange(hasSession);
        }
        
        setSessionVerified(true);
      } catch (error) {
        console.error("Index - Erreur lors de la vérification de session:", error);
        setSessionVerified(true); // Continuer malgré l'erreur
      } finally {
        // Terminer le chargement après un court délai
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    checkSession();
    
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
  }, [isAuthenticated, onAuthChange]);

  // Gérer le login
  const handleLogin = () => {
    onAuthChange(true);
  };
  
  // Afficher le loading screen pendant le chargement initial
  if (isLoading || !sessionVerified) {
    return <LoadingScreen message="Chargement..." />;
  }
  
  // Une fois les vérifications terminées, rediriger en fonction de l'état d'authentification
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <LoginForm onLogin={handleLogin} />;
  }
};

export default Index;
