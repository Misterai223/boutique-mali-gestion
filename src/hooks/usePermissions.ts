
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/profile';
import { hasPageAccess, getAllowedPages, isAdmin, isCashier, isSalesperson } from '@/utils/permissions';
import { supabase } from '@/integrations/supabase/client';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState<UserRole>('user'); // Rôle par défaut restrictif
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer le rôle réel de l'utilisateur depuis la base de données
    const loadUserRoleFromDatabase = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('Aucun utilisateur connecté');
          setUserRole('user');
          setLoading(false);
          return;
        }

        console.log('Utilisateur connecté, récupération du profil depuis la DB...');
        
        // Récupérer le profil utilisateur depuis la base de données
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          setUserRole('user'); // Toujours defaulter à 'user' en cas d'erreur
        } else if (profile) {
          console.log('Rôle récupéré de la DB:', profile.role);
          // Vérifier que le rôle est valide, sinon defaulter à 'user'
          const validRoles: UserRole[] = ['admin', 'manager', 'cashier', 'salesperson', 'user'];
          const roleFromDB = profile.role as UserRole;
          
          if (validRoles.includes(roleFromDB)) {
            setUserRole(roleFromDB);
            localStorage.setItem("userRole", roleFromDB);
          } else {
            console.warn('Rôle invalide récupéré:', profile.role, 'Defaulting à user');
            setUserRole('user');
            localStorage.setItem("userRole", 'user');
          }
        } else {
          console.log('Aucun profil trouvé, rôle par défaut: user');
          setUserRole('user');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);
        setUserRole('user'); // Toujours defaulter à 'user' en cas d'exception
      } finally {
        setLoading(false);
      }
    };

    loadUserRoleFromDatabase();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Changement d\'état d\'authentification:', event);
        
        if (event === 'SIGNED_OUT' || !session) {
          setUserRole('user');
          localStorage.removeItem("userRole");
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Recharger le rôle depuis la base de données
          loadUserRoleFromDatabase();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
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
