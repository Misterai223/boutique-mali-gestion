
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("Hook useAuth initialisé");
    
    // Vérifier la session actuelle
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        console.log("État d'authentification initialisé à:", !!session);
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Changement d'état auth:", event, !!session);
        setIsAuthenticated(!!session);
        
        if (!session) {
          // Nettoyer le localStorage quand l'utilisateur se déconnecte
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");
          localStorage.removeItem("accessLevel");
        } else {
          localStorage.setItem("isAuthenticated", "true");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogin = () => {
    console.log("handleLogin appelé, mise à jour de l'état");
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    toast.success("Connexion réussie");
  };
  
  const handleLogout = async () => {
    console.log("Déconnexion initiée");
    
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("accessLevel");
      setIsAuthenticated(false);
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };
  
  return {
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout
  };
};
