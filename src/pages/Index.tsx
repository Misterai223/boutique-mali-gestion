
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "./Dashboard";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import LoadingScreen from "@/components/layout/LoadingScreen";

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
    
    // Vérifier la session Supabase au chargement
    const checkSession = async () => {
      setLoading(true);
      try {
        const session = await authService.getSession();
        if (session) {
          // Récupérer les données utilisateur
          const userData = await authService.getCurrentUser();
          if (userData) {
            console.log("Session valide trouvée, utilisateur authentifié:", userData?.data?.email);
            onAuthChange(true);
            localStorage.setItem("isAuthenticated", "true");
            toast.success(`Bienvenue sur Shop Manager`);
          }
        } else {
          console.log("Aucune session active trouvée");
          localStorage.removeItem("isAuthenticated");
          onAuthChange(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // S'abonner aux changements d'authentification
    const { data: { subscription } } = authService.subscribeToAuthChanges((event, session) => {
      console.log("Événement d'authentification global:", event);
      
      if (session) {
        console.log("Session active détectée, mise à jour de l'état");
        setTimeout(() => {
          onAuthChange(true);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("Déconnexion détectée, mise à jour de l'état");
        setTimeout(() => {
          onAuthChange(false);
          localStorage.removeItem("userRole");
          localStorage.removeItem("accessLevel");
          localStorage.removeItem("isAuthenticated");
        }, 0);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthChange, navigate]);
  
  // Gérer le thème au chargement initial
  useEffect(() => {
    if (mounted) {
      // Vérifier la préférence système
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      
      if (savedTheme) {
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      } else if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, [mounted]);
  
  const handleLogin = () => {
    console.log("handleLogin appelé, mise à jour de l'état");
    onAuthChange(true);
    toast.success("Connexion réussie");
  };
  
  const handleLogout = async () => {
    console.log("Déconnexion initiée");
    try {
      await authService.logout();
      localStorage.removeItem("isAuthenticated");
      onAuthChange(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      localStorage.removeItem("isAuthenticated");
      onAuthChange(false);
    }
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
  
  // Sinon, rediriger vers le formulaire de login
  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
