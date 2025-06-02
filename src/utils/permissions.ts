
import { UserRole } from '@/types/profile';

// Type pour les pages autorisées
export type AllowedPage = 
  | 'dashboard'
  | 'products' 
  | 'categories'
  | 'clients'
  | 'user-management'
  | 'employees'
  | 'finances'
  | 'reports'
  | 'media'
  | 'settings';

// Configuration des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, AllowedPage[]> = {
  admin: [
    'dashboard',
    'products', 
    'categories',
    'clients',
    'user-management',
    'employees',
    'finances',
    'reports',
    'media',
    'settings'
  ],
  manager: [
    'dashboard',
    'products',
    'categories',
    'clients',
    'employees',
    'finances',
    'reports',
    'media',
    'settings'
  ],
  cashier: [
    'dashboard',
    'products',
    'categories', 
    'clients',
    'finances',
    'reports',
    'media'
  ],
  salesperson: [
    'dashboard',
    'products',
    'categories',
    'clients', 
    'media'
  ],
  user: [
    'dashboard'
  ]
};

// Fonction pour vérifier si un rôle a accès à une page
export const hasPageAccess = (userRole: UserRole, page: string): boolean => {
  console.log(`Vérification d'accès: rôle=${userRole}, page=${page}`);
  
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    console.log('Rôle non valide ou permissions non trouvées');
    return false;
  }
  
  const permissions = ROLE_PERMISSIONS[userRole];
  const hasAccess = permissions.includes(page as AllowedPage);
  console.log(`Permissions pour ${userRole}:`, permissions, `Accès à ${page}:`, hasAccess);
  
  return hasAccess;
};

// Fonction pour obtenir les pages autorisées pour un rôle
export const getAllowedPages = (userRole: UserRole): string[] => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return ['dashboard']; // Au minimum le tableau de bord
  }
  
  return ROLE_PERMISSIONS[userRole];
};

// Fonction pour vérifier si l'utilisateur est administrateur
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin';
};

// Fonction pour vérifier si l'utilisateur est manager
export const isManager = (userRole: UserRole): boolean => {
  return userRole === 'manager';
};

// Fonction pour vérifier si l'utilisateur est caissier
export const isCashier = (userRole: UserRole): boolean => {
  return userRole === 'caissier';
};

// Fonction pour vérifier si l'utilisateur est vendeur
export const isSalesperson = (userRole: UserRole): boolean => {
  return userRole === 'salesperson';
};
