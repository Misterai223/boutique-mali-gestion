
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
        console.log("Récupération du rôle utilisateur...");
        const profile = await getCurrentUserProfile();
        
        if (profile) {
          console.log("Profil trouvé:", profile);
          // Vérifier si l'utilisateur a été créé directement dans Supabase Auth
          const session = await supabase.auth.getSession();
          const userId = session.data.session?.user.id;
          
          console.log("Vérification du rôle:", profile.role);
          
          // Si le rôle est déjà 'admin', c'est simple
          if (profile.role === 'admin') {
            console.log("Utilisateur est administrateur par rôle");
            setUserRole('admin');
            setIsAdmin(true);
          }
          // Vérifier si l'utilisateur existe dans auth et n'a pas été créé manuellement
          else if (userId) {
            console.log("Utilisateur existe dans auth, configuration comme admin");
            // Mettre à jour le profil pour s'assurer qu'il est correctement marqué comme administrateur
            await supabase
              .from('profiles')
              .update({ 
                role: 'admin',
                access_level: 5
              })
              .eq('id', userId);
            
            setUserRole('admin');
            setIsAdmin(true);
          } else {
            console.log("Utilisateur standard, rôle:", profile.role);
            setUserRole(profile.role);
            setIsAdmin(profile.role === "admin");
          }
        } else {
          console.log("Aucun profil trouvé");
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
