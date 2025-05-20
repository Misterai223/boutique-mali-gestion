
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useAuth = () => {
  // État d'authentification initialisé à false par défaut
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Effet pour initialiser l'état d'authentification au montage du composant
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    
    // Simulation d'une vérification d'authentification
    setTimeout(() => {
      setIsAuthenticated(false);
      setLoading(false);
      console.log("État d'authentification initialisé à false");
    }, 1000);
    
  }, []);
  
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
