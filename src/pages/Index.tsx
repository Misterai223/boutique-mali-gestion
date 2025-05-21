
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Gestion du thème au chargement
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (isDark) {
      document.documentElement.classList.add("dark");
    }
    
    // Simuler un chargement
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Rediriger vers le dashboard si déjà authentifié
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);
  
  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
    navigate('/dashboard', { replace: true });
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Afficher le formulaire de login si non authentifié
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
