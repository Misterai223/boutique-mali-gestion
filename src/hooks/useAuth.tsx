
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  // État pour suivre l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  
  // Référence pour suivre si le composant est monté
  const isMounted = useRef(true);
  
  // Fonction pour gérer la connexion
  const handleLogin = useCallback((newSession: Session) => {
    if (!isMounted.current) return;
    
    try {
      console.log("Session utilisateur détectée, mise à jour de l'état");
      setSession(newSession);
      setIsAuthenticated(true);
      
      // Stocker l'état d'authentification (optionnel, car Supabase gère déjà la session)
      localStorage.setItem("isAuthenticated", "true");
      
      toast.success("Connexion réussie");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setAuthError(error as Error);
    }
  }, []);
  
  // Fonction pour gérer la déconnexion
  const handleLogout = useCallback(async () => {
    try {
      console.log("Déconnexion initiée");
      
      // Déconnexion Supabase
      await supabase.auth.signOut();
      
      // Nettoyer l'état local
      if (isMounted.current) {
        setSession(null);
        setIsAuthenticated(false);
        
        // Nettoyer localStorage
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("accessLevel");
        
        toast.success("Déconnexion réussie");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // En cas d'erreur, forcer quand même la déconnexion locale
      if (isMounted.current) {
        setSession(null);
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, []);
  
  // Initialisation et vérification de la session
  useEffect(() => {
    console.log("Initialisation du hook useAuth");
    
    const initAuth = async () => {
      try {
        // Récupérer la session actuelle
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          console.log("Session active trouvée");
          if (isMounted.current) {
            setSession(data.session);
            setIsAuthenticated(true);
          }
        } else {
          console.log("Aucune session active");
          if (isMounted.current) {
            setIsAuthenticated(false);
            // Nettoyer localStorage en cas d'incohérence
            localStorage.removeItem("isAuthenticated");
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'authentification:", error);
        if (isMounted.current) {
          setAuthError(error as Error);
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      } finally {
        if (isMounted.current) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };
    
    // S'abonner aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Événement d'authentification:", event);
        
        if (event === "SIGNED_IN" && newSession) {
          console.log("Utilisateur connecté");
          if (isMounted.current) {
            setSession(newSession);
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Utilisateur déconnecté");
          if (isMounted.current) {
            setSession(null);
            setIsAuthenticated(false);
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userRole");
            localStorage.removeItem("accessLevel");
          }
        } else if (event === "TOKEN_REFRESHED" && newSession) {
          console.log("Token rafraîchi");
          if (isMounted.current) {
            setSession(newSession);
          }
        }
      }
    );
    
    // Initialiser l'authentification
    initAuth();
    
    // Nettoyage lors du démontage
    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    isAuthenticated,
    session,
    loading,
    authInitialized,
    authError,
    handleLogin,
    handleLogout
  };
};

export default useAuth;
