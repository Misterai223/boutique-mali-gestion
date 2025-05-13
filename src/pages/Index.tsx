
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
    
    // Check Supabase session on load
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onAuthChange(true);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          onAuthChange(true);
        } else if (event === 'SIGNED_OUT') {
          onAuthChange(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthChange]);
  
  // Handle theme on initial load
  useEffect(() => {
    if (mounted) {
      // Check for system preference
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
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
