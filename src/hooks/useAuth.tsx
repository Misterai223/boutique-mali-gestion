
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("Vérification de l'authentification au démarrage");
        const session = await authService.getSession();
        if (session) {
          console.log("Session trouvée au démarrage, authentification");
          const userData = await authService.getCurrentUser();
          setUser(userData);
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
        
        if (event === 'SIGNED_IN' && session) {
          console.log("App - Connexion détectée");
          // Utiliser setTimeout pour éviter les deadlocks
          setTimeout(async () => {
            try {
              // Récupérer les informations de l'utilisateur à chaque connexion
              const userData = await authService.getCurrentUser();
              setUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem("isAuthenticated", "true");
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("App - Déconnexion détectée");
          setTimeout(() => {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("isAuthenticated");
          }, 0);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogin = async () => {
    console.log("handleLogin appelé, mise à jour de l'état");
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Connexion réussie");
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
  };
  
  const handleLogout = async () => {
    console.log("Déconnexion initiée");
    try {
      await authService.logout();
      localStorage.removeItem("isAuthenticated");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Force logout even if there's an error
      localStorage.removeItem("isAuthenticated");
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  return {
    isAuthenticated,
    loading,
    user,
    handleLogin,
    handleLogout
  };
};
