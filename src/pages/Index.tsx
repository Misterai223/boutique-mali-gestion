
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "./Dashboard";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { authService } from "@/services/authService";

const Index = ({ 
  isAuthenticated, 
  onAuthChange 
}: { 
  isAuthenticated: boolean; 
  onAuthChange: (value: boolean) => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    setMounted(true);
    
    // Gestion du thème au chargement
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (isDark) {
      document.documentElement.classList.add("dark");
    }
    
    // Vérification de l'état d'authentification et de la session
    const checkSession = async () => {
      if (isAuthenticated) {
        try {
          const session = await authService.getSession();
          if (!session) {
            // Si nous sommes considérés comme authentifiés mais qu'il n'y a pas de session,
            // on nettoie l'état d'authentification
            console.log("Index - État d'authentification incohérent, déconnexion");
            onAuthChange(false);
          }
        } catch (error) {
          console.error("Erreur lors de la vérification de la session:", error);
        }
      }
      setLoading(false);
    };
    
    checkSession();
  }, [isAuthenticated, onAuthChange]);
  
  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
    navigate('/dashboard');
  };
  
  const handleLogout = async () => {
    console.log("Index - handleLogout appelé");
    onAuthChange(false);
    navigate('/login');
  };
  
  if (!mounted || loading) {
    return <LoadingScreen />;
  }
  
  // Si l'utilisateur est authentifié, afficher le tableau de bord
  if (isAuthenticated) {
    return (
      <DashboardLayout onLogout={handleLogout}>
        <Dashboard />
      </DashboardLayout>
    );
  }
  
  // Sinon, afficher le formulaire de login
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
