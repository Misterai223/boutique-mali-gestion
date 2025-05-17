
import { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "./Dashboard";
import LoadingScreen from "@/components/layout/LoadingScreen";

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
    
    // Gestion du thème au chargement
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  const handleLogin = () => {
    console.log("Index - handleLogin appelé");
    onAuthChange(true);
  };
  
  const handleLogout = () => {
    console.log("Index - handleLogout appelé");
    onAuthChange(false);
  };
  
  if (!mounted) {
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
