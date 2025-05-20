
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "./Dashboard";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const Index = ({ 
  isAuthenticated, 
  onAuthChange 
}: { 
  isAuthenticated: boolean; 
  onAuthChange: (value: boolean) => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    
    // Vérifier la session Supabase au chargement
    const checkSession = async () => {
      setLoading(true);
      try {
        const session = await authService.getSession();
        if (session) {
          // Récupérer les données utilisateur
          const user = await authService.getCurrentUser();
          if (user) {
            onAuthChange(true);
            toast.success(`Bienvenue sur Shop Manager`);
          }
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
      if (session) {
        onAuthChange(true);
      } else if (event === 'SIGNED_OUT') {
        onAuthChange(false);
        localStorage.removeItem("userRole");
        localStorage.removeItem("accessLevel");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthChange]);
  
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
    onAuthChange(true);
    toast.success("Connexion réussie");
  };
  
  const handleLogout = async () => {
    await authService.logout();
    onAuthChange(false);
  };
  
  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }
  
  return (
    <DashboardLayout onLogout={handleLogout}>
      <Dashboard />
    </DashboardLayout>
  );
};

export default Index;
