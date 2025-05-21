
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useAuth = () => {
  // Initialize authentication state from localStorage, if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth === "true";
  });
  const [loading, setLoading] = useState(true);
  
  // Effect to initialize auth state on component mount
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    
    // Just ensure loading state is updated after a brief delay
    setTimeout(() => {
      setLoading(false);
      console.log("État d'authentification initialisé à:", isAuthenticated);
    }, 500);
    
  }, [isAuthenticated]);
  
  const handleLogin = () => {
    console.log("handleLogin appelé, mise à jour de l'état");
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    toast.success("Connexion réussie");
  };
  
  const handleLogout = () => {
    console.log("Déconnexion initiée");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessLevel");
    setIsAuthenticated(false);
    toast.success("Déconnexion réussie");
  };
  
  return {
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout
  };
};
