
import { useState, useEffect } from "react";
import { NavItem } from "@/components/layout/sidebar/navigation-items";
import { getCurrentUserProfile } from "@/services/users/userProfileService";
import { supabase } from "@/integrations/supabase/client";

// Liste des routes accessibles par défaut (même sans profil)
const DEFAULT_ALLOWED_ROUTES = [
  "/dashboard"
];

// Menus accessibles pour les employés
const EMPLOYEE_ALLOWED_ROUTES = [
  "/dashboard", 
  "/products", 
  "/categories", 
  "/employees", 
  "/finances", 
  "/media",
  "/clients"
];

export const useRolePermissions = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessLevel, setAccessLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Vérifier d'abord si une session est active
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsSessionActive(!!data.session);
    };
    
    checkSession();
  }, []);

  // Récupérer le rôle utilisateur seulement si une session est active
  useEffect(() => {
    if (!isSessionActive) {
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const profile = await getCurrentUserProfile();
        
        if (profile) {
          setUserRole(profile.role);
          setIsAdmin(profile.role === "admin");
          setAccessLevel(profile.access_level);
        } else {
          // Par défaut, donner accès limité
          setUserRole("user");
          setIsAdmin(false);
          setAccessLevel(1);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        // Par défaut, donner accès limité en cas d'erreur
        setUserRole("user");
        setIsAdmin(false);
        setAccessLevel(1);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isSessionActive]);

  // Filtre les éléments de navigation en fonction du rôle
  const filterNavItems = (items: NavItem[]): NavItem[] => {
    if (!isSessionActive) {
      return [];
    }
    
    if (isAdmin) {
      // Les admins ont accès à tous les menus
      return items;
    }
    
    // Les employés ont accès limité
    return items.filter(item => 
      EMPLOYEE_ALLOWED_ROUTES.some(path => item.href.includes(path))
    );
  };

  // Vérifie si l'utilisateur a accès à une route spécifique
  const hasAccess = (path: string): boolean => {
    if (!isSessionActive) {
      return false;
    }
    
    // Vérifier si la route est dans les routes par défaut
    if (DEFAULT_ALLOWED_ROUTES.some(route => path.includes(route))) {
      return true;
    }
    
    if (isAdmin) {
      return true;
    }
    
    return EMPLOYEE_ALLOWED_ROUTES.some(route => path.includes(route));
  };

  return {
    userRole,
    isAdmin,
    accessLevel,
    loading,
    filterNavItems,
    hasAccess,
    isSessionActive
  };
};
