
import { useState, useEffect } from "react";
import { NavItem } from "@/components/layout/sidebar/navigation-items";
import { getCurrentUserProfile } from "@/services/users/userProfileService";

// Menus accessibles pour les employés
const ALLOWED_EMPLOYEE_MENUS = [
  "/products", 
  "/categories", 
  "/orders", 
  "/employees", 
  "/finances", 
  "/media"
];

export const useRolePermissions = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const profile = await getCurrentUserProfile();
        
        if (profile) {
          setUserRole(profile.role);
          setIsAdmin(profile.role === "admin");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Filtre les éléments de navigation en fonction du rôle
  const filterNavItems = (items: NavItem[]): NavItem[] => {
    if (isAdmin) {
      // Les admins ont accès à tous les menus
      return items;
    }
    
    // Les employés ont accès limité
    return items.filter(item => 
      ALLOWED_EMPLOYEE_MENUS.some(path => item.href.includes(path))
    );
  };

  // Vérifie si l'utilisateur a accès à une route spécifique
  const hasAccess = (path: string): boolean => {
    if (isAdmin) {
      return true;
    }
    
    return ALLOWED_EMPLOYEE_MENUS.some(allowedPath => path.includes(allowedPath));
  };

  return {
    userRole,
    isAdmin,
    loading,
    filterNavItems,
    hasAccess
  };
};
