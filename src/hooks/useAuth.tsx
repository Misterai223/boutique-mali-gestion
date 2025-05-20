
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuth = () => {
  // État d'authentification initialisé à false par défaut
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Effet pour vérifier la session au montage du composant
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    let isMounted = true;
    
    const checkAuthentication = async () => {
      try {
        console.log("Vérification de l'authentification au démarrage");
        const session = await authService.getSession();
        
        if (session && isMounted) {
          console.log("Session trouvée au démarrage, authentification");
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          
          // Charger les données utilisateur de manière asynchrone
          try {
            const userData = await authService.getCurrentUser();
            if (isMounted) setUser(userData);
          } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
          }
        } else if (isMounted) {
          console.log("Aucune session trouvée au démarrage");
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuthentication();
    
    // S'abonner aux changements d'authentification globaux
    const { data: { subscription } } = authService.subscribeToAuthChanges(
      (event, session) => {
        console.log("useAuth - Événement d'authentification:", event);
        
        if (event === 'SIGNED_IN' && session && isMounted) {
          console.log("useAuth - Connexion détectée");
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          
          // Utiliser setTimeout pour éviter les deadlocks
          setTimeout(async () => {
            try {
              const userData = await authService.getCurrentUser();
              if (isMounted) setUser(userData);
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT' && isMounted) {
          console.log("useAuth - Déconnexion détectée");
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      }
    );
    
    return () => {
      console.log("Nettoyage du hook useAuth");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogin = () => {
    console.log("handleLogin appelé, mise à jour de l'état");
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    toast.success("Connexion réussie");
    
    // Charger les données utilisateur de manière asynchrone
    setTimeout(async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    }, 0);
  };
  
  const handleLogout = async () => {
    console.log("Déconnexion initiée");
    try {
      await authService.logout();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("accessLevel");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Force logout even if there's an error
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("accessLevel");
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
