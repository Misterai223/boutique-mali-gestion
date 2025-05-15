
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "./Dashboard";
import { supabase } from "@/integrations/supabase/client";

const Index = ({ 
  isAuthenticated, 
  onAuthChange 
}: { 
  isAuthenticated: boolean; 
  onAuthChange: (value: boolean) => void;
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Vérifier la session Supabase au chargement
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onAuthChange(true);
      }
    };
    
    checkSession();
    
    // S'abonner aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          onAuthChange(true);
        } else if (event === 'SIGNED_OUT') {
          onAuthChange(false);
          localStorage.removeItem("userRole");
        }
      }
    );
    
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
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onAuthChange(false);
  };
  
  if (!mounted) {
    return null;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-primary/5 to-secondary/10">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }
  
  return (
    <DashboardLayout onLogout={handleLogout}>
      <Dashboard />
    </DashboardLayout>
  );
};

export default Index;
