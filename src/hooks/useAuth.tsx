
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuth = () => {
  // État d'authentification basé sur le localStorage avec une valeur par défaut
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Effet pour vérifier la session au montage du composant
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    
    const checkAuthentication = async () => {
      try {
        console.log("Vérification de l'authentification au démarrage");
        // Pour le développement, considérez toujours l'utilisateur comme authentifié
        // Vous pouvez supprimer cette ligne lorsque l'authentification fonctionne
        const devMode = process.env.NODE_ENV === 'development';
        if (devMode) {
          console.log("Mode développement activé, authentification automatique");
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          setLoading(false);
          return;
        }
        
        // Vérification normale de l'authentification
        const session = await authService.getSession();
        
        if (session) {
          console.log("Session trouvée au démarrage, authentification");
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          
          // Charger les données utilisateur de manière asynchrone
          setTimeout(async () => {
            try {
              const userData = await authService.getCurrentUser();
              setUser(userData);
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
          }, 0);
        } else {
          console.log("Aucune session trouvée au démarrage");
          // En mode développement, on force l'authentification
          if (devMode) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("isAuthenticated");
          }
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
        console.log("useAuth - Événement d'authentification:", event);
        
        if (event === 'SIGNED_IN' && session) {
          console.log("useAuth - Connexion détectée");
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          
          // Utiliser setTimeout pour éviter les deadlocks
          setTimeout(async () => {
            try {
              const userData = await authService.getCurrentUser();
              setUser(userData);
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("useAuth - Déconnexion détectée");
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      }
    );
    
    return () => {
      console.log("Nettoyage du hook useAuth");
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
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Déconnexion réussie");
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
