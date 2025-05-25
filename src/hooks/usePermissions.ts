
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/profile';
import { hasPageAccess, getAllowedPages, isAdmin, isCashier, isSalesperson } from '@/utils/permissions';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis le localStorage
    const loadUserRole = () => {
      try {
        const savedRole = localStorage.getItem("userRole") as UserRole;
        if (savedRole && ['admin', 'cashier', 'salesperson'].includes(savedRole)) {
          setUserRole(savedRole);
        } else {
          setUserRole('user'); // Rôle par défaut
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();

    // Écouter les changements de rôle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userRole") {
        const newRole = e.newValue as UserRole;
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
    return hasPageAccess(userRole, page);
  };

  const getAllowedPagesForUser = (): string[] => {
    return getAllowedPages(userRole);
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
