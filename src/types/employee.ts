
export interface Employee {
  id: string;
  full_name: string;
  email?: string; // Facultatif
  phone?: string;
  role: string; // Rôle dans l'entreprise (pas dans l'application)
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export type EmployeeRole = 
  | 'manager' 
  | 'sales_representative' 
  | 'cashier' 
  | 'warehouse_worker' 
  | 'accountant' 
  | 'secretary'
  | 'technician'
  | 'other';
