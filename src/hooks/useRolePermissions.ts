import { useState, useEffect } from "react";
import { NavItem } from "@/components/layout/sidebar/navigation-items";
import { getCurrentUserProfile } from "@/services/users/userProfileService";
import { supabase } from "@/integrations/supabase/client";

// Menus accessibles pour les employés
const ALLOWED_EMPLOYEE_MENUS = [
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const profile = await getCurrentUserProfile();
        
        if (profile) {
          // Vérifier si l'utilisateur a été créé directement dans Supabase Auth
          // Les utilisateurs créés directement dans Supabase sont considérés comme administrateurs
          const session = await supabase.auth.getSession();
          const userId = session.data.session?.user.id;
          
          // Si le rôle est déjà 'admin', on le garde
          if (profile.role === 'admin') {
            setUserRole('admin');
            setIsAdmin(true);
          }
          // Sinon, on vérifie la méthode de création
          else if (userId) {
            // Si l'utilisateur existe dans auth mais n'a pas été créé par un autre admin,
            // on le considère comme admin par défaut
            setUserRole('admin');
            setIsAdmin(true);
          } else {
            setUserRole(profile.role);
            setIsAdmin(profile.role === "admin");
          }
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
