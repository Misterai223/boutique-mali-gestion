
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("Vérification de l'authentification au démarrage");
        const session = await authService.getSession();
        if (session) {
          console.log("Session trouvée au démarrage, authentification");
          await authService.getCurrentUser(); // Récupère et stocke les infos utilisateur
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
        } else {
          console.log("Aucune session trouvée au démarrage");
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
    
    // S'abonner aux changements d'authentification globaux
    const { data: { subscription } } = authService.subscribeToAuthChanges(
      (event, session) => {
        console.log("App - Événement d'authentification:", event);
        
        // Utiliser setTimeout pour éviter les problèmes de deadlock
        setTimeout(() => {
          if (event === 'SIGNED_IN' && session) {
            console.log("App - Connexion détectée");
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
          } else if (event === 'SIGNED_OUT') {
            console.log("App - Déconnexion détectée");
            setIsAuthenticated(false);
            localStorage.removeItem("isAuthenticated");
          }
        }, 0);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogin = () => {
    console.log("handleLogin appelé, mise à jour de l'état");
    setIsAuthenticated(true);
    toast.success("Connexion réussie");
  };
  
  const handleLogout = async () => {
    console.log("Déconnexion initiée");
    await authService.logout();
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };
  
  return {
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout
  };
};
