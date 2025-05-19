
import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuth = () => {
  // État d'authentification basé sur le localStorage avec une valeur par défaut
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Fonction handleLogin mémorisée pour éviter les recréations inutiles
  const handleLogin = useCallback(() => {
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
  }, []);
  
  // Fonction handleLogout mémorisée
  const handleLogout = useCallback(async () => {
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
  }, []);
  
  // Effet pour vérifier la session au montage du composant
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    let isMounted = true; // Flag pour éviter les mises à jour après le démontage
    
    const checkAuthentication = async () => {
      try {
        console.log("Vérification de l'authentification au démarrage");
        // Vérifier d'abord le localStorage
        const isAuthenticatedFromStorage = localStorage.getItem("isAuthenticated") === "true";
        
        // Pour le développement, considérer toujours l'utilisateur comme authentifié
        const devMode = true; // Force en mode développement pour tester
        if (devMode) {
          console.log("Mode développement activé, authentification automatique");
          if (isMounted) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            setAuthInitialized(true);
            
            // Délai pour assurer une meilleure stabilité
            setTimeout(() => {
              if (isMounted) {
                setLoading(false);
              }
            }, 500);
          }
          return;
        }
        
        // Vérification normale de l'authentification
        const session = await authService.getSession();
        
        if (session && isMounted) {
          console.log("Session trouvée au démarrage, authentification");
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          
          // Charger les données utilisateur de manière asynchrone
          setTimeout(async () => {
            try {
              if (isMounted) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
              }
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            } finally {
              if (isMounted) {
                setAuthInitialized(true);
                setLoading(false);
              }
            }
          }, 500);
        } else if (isMounted) {
          console.log("Aucune session trouvée au démarrage");
          // En mode développement, on force l'authentification
          if (devMode) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("isAuthenticated");
          }
          setAuthInitialized(true);
          setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 500);
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
          setAuthInitialized(true);
          setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 500);
        }
      }
    };

    // Délai pour éviter les problèmes de rendu trop rapide
    setTimeout(() => {
      checkAuthentication();
    }, 300);
    
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
              if (isMounted) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
              }
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT' && isMounted) {
          console.log("useAuth - Déconnexion détectée");
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");
          localStorage.removeItem("accessLevel");
        }
      }
    );
    
    return () => {
      console.log("Nettoyage du hook useAuth");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    isAuthenticated,
    loading,
    user,
    authInitialized,
    handleLogin,
    handleLogout
  };
};
