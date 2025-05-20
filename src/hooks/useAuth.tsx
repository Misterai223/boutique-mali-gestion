
import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  // État d'authentification géré de manière plus robuste
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initialiser à false par défaut
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  
  // Fonction handleLogin mémorisée et améliorée
  const handleLogin = useCallback(() => {
    try {
      console.log("handleLogin appelé, mise à jour de l'état");
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Connexion réussie");
      
      // Charger les données utilisateur avec un délai minimal mais en dehors du flow principal
      setTimeout(async () => {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
          // Ne pas modifier l'état d'authentification en cas d'erreur ici
        }
      }, 50);
    } catch (error) {
      console.error("Erreur dans handleLogin:", error);
      // En cas d'erreur grave, on maintient quand même l'authentification en mode développement
      if (process.env.NODE_ENV !== 'development') {
        setIsAuthenticated(false);
      }
    }
  }, []);
  
  // Fonction handleLogout améliorée avec gestion d'erreurs
  const handleLogout = useCallback(async () => {
    console.log("Déconnexion initiée");
    try {
      // Nettoyer localStorage d'abord pour éviter des problèmes de synchronisation
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("accessLevel");
      
      // Ensuite mettre à jour l'état pour éviter des rendus superflus
      setUser(null);
      setIsAuthenticated(false);
      
      // Puis informer l'utilisateur et appeler le service d'authentification
      toast.success("Déconnexion réussie");
      await authService.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Toujours considérer l'utilisateur déconnecté même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);
  
  // Effet pour vérifier la session au montage avec une logique améliorée
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    let isMounted = true; // Protection contre les mises à jour après démontage
    let initTimeout: ReturnType<typeof setTimeout>;
    
    const checkAuthentication = async () => {
      try {
        console.log("Vérification de l'authentification au démarrage");
        
        // **MODIFICATION IMPORTANTE**: Vérifier d'abord la session Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        const hasActiveSession = !!sessionData.session;
        console.log("Session Supabase active:", hasActiveSession);
        
        // Mode développement avec vérification pour éviter la boucle
        const devMode = true; // Force en mode développement pour tester
        if (devMode) {
          console.log("Mode développement activé");
          // **MODIFICATION**: En dev mode, on respecte quand même la session réelle
          if (hasActiveSession) {
            console.log("Session active détectée, authentification automatique");
            if (isMounted) {
              setIsAuthenticated(true);
              try {
                localStorage.setItem("isAuthenticated", "true");
              } catch (e) {
                console.error("Erreur localStorage:", e);
              }
            }
          } else {
            console.log("Pas de session active, redirection vers login");
            if (isMounted) {
              setIsAuthenticated(false);
              try {
                localStorage.removeItem("isAuthenticated");
              } catch (e) {
                console.error("Erreur localStorage:", e);
              }
            }
          }
          
          if (isMounted) {
            setAuthInitialized(true);
            initTimeout = setTimeout(() => {
              if (isMounted) {
                setLoading(false);
              }
            }, 800);
          }
          return;
        }
        
        // Vérification normale de l'authentification (pour la production)
        const session = await authService.getSession();
        
        if (session && isMounted) {
          console.log("Session trouvée au démarrage, authentification");
          setIsAuthenticated(true);
          try {
            localStorage.setItem("isAuthenticated", "true");
          } catch (e) {
            console.error("Erreur localStorage:", e);
          }
          
          // Charger les données utilisateur avec un délai
          initTimeout = setTimeout(async () => {
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
          }, 800);
        } else if (isMounted) {
          console.log("Aucune session trouvée au démarrage");
          // En mode développement, on force l'authentification uniquement s'il y a une session
          if (devMode && hasActiveSession) {
            setIsAuthenticated(true);
            try {
              localStorage.setItem("isAuthenticated", "true");
            } catch (e) {
              console.error("Erreur localStorage:", e);
            }
          } else {
            setIsAuthenticated(false);
            try {
              localStorage.removeItem("isAuthenticated");
            } catch (e) {
              console.error("Erreur localStorage:", e);
            }
          }
          setAuthInitialized(true);
          initTimeout = setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 800);
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setAuthError(error as Error);
        if (isMounted) {
          setIsAuthenticated(false);
          try {
            localStorage.removeItem("isAuthenticated");
          } catch (e) {
            console.error("Erreur localStorage:", e);
          }
          setAuthInitialized(true);
          initTimeout = setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 800);
        }
      }
    };

    // Délai pour éviter les problèmes de rendu trop rapide
    const startupTimeout = setTimeout(() => {
      checkAuthentication();
    }, 500);
    
    // S'abonner aux changements d'authentification globaux
    const { data: { subscription } } = authService.subscribeToAuthChanges(
      (event, session) => {
        console.log("useAuth - Événement d'authentification:", event);
        
        if (event === 'SIGNED_IN' && session && isMounted) {
          console.log("useAuth - Connexion détectée");
          setIsAuthenticated(true);
          try {
            localStorage.setItem("isAuthenticated", "true");
          } catch (e) {
            console.error("Erreur localStorage:", e);
          }
          
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
          }, 50);
        } else if (event === 'SIGNED_OUT' && isMounted) {
          console.log("useAuth - Déconnexion détectée");
          setUser(null);
          setIsAuthenticated(false);
          try {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userRole");
            localStorage.removeItem("accessLevel");
          } catch (e) {
            console.error("Erreur localStorage:", e);
          }
        }
      }
    );
    
    return () => {
      console.log("Nettoyage du hook useAuth");
      isMounted = false;
      clearTimeout(startupTimeout);
      if (initTimeout) clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    isAuthenticated,
    loading,
    user,
    authInitialized,
    authError,
    handleLogin,
    handleLogout
  };
};
