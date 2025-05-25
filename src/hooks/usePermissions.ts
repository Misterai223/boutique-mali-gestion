
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/profile';
import { hasPageAccess, getAllowedPages, isAdmin, isCashier, isSalesperson } from '@/utils/permissions';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState<UserRole>('salesperson'); // Rôle par défaut valide
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis le localStorage
    const loadUserRole = () => {
      try {
        const savedRole = localStorage.getItem("userRole") as UserRole;
        console.log('Rôle récupéré du localStorage:', savedRole);
        
        if (savedRole && ['admin', 'cashier', 'salesperson'].includes(savedRole)) {
          setUserRole(savedRole);
          console.log('Rôle utilisateur défini à:', savedRole);
        } else {
          // Si aucun rôle valide, définir par défaut sur admin pour le développement
          const defaultRole = 'admin';
          setUserRole(defaultRole);
          localStorage.setItem("userRole", defaultRole);
          console.log('Aucun rôle valide trouvé, défini par défaut à:', defaultRole);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);
        const defaultRole = 'admin';
        setUserRole(defaultRole);
        localStorage.setItem("userRole", defaultRole);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();

    // Écouter les changements de rôle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userRole") {
        const newRole = e.newValue as UserRole;
        console.log('Changement de rôle détecté:', newRole);
        if (newRole && ['admin', 'cashier', 'salesperson'].includes(newRole)) {
          setUserRole(newRole);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkPageAccess = (page: string): boolean => {
    const access = hasPageAccess(userRole, page);
    console.log(`Vérification d'accès pour ${page} avec le rôle ${userRole}:`, access);
    return access;
  };

  const getAllowedPagesForUser = (): string[] => {
    const pages = getAllowedPages(userRole);
    console.log(`Pages autorisées pour le rôle ${userRole}:`, pages);
    return pages;
  };

  return {
    userRole,
    loading,
    checkPageAccess,
    getAllowedPagesForUser,
    isAdmin: isAdmin(userRole),
    isCashier: isCashier(userRole),
    isSalesperson: isSalesperson(userRole)
  };
};
