
import { UserRole } from '@/types/profile';

// Configuration des permissions par rôle
export const ROLE_PERMISSIONS = {
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
  ]
} as const;

// Fonction pour vérifier si un rôle a accès à une page
export const hasPageAccess = (userRole: UserRole, page: string): boolean => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  
  return ROLE_PERMISSIONS[userRole].includes(page);
};

// Fonction pour obtenir les pages autorisées pour un rôle
export const getAllowedPages = (userRole: UserRole): string[] => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return [];
  }
  
  return ROLE_PERMISSIONS[userRole];
};

// Fonction pour vérifier si l'utilisateur est administrateur
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin';
};

// Fonction pour vérifier si l'utilisateur est caissier
export const isCashier = (userRole: UserRole): boolean => {
  return userRole === 'cashier';
};

// Fonction pour vérifier si l'utilisateur est vendeur
export const isSalesperson = (userRole: UserRole): boolean => {
  return userRole === 'salesperson';
};
