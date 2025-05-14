
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  access_level: number;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'manager' | 'salesperson' | 'cashier' | 'user';

export type AccessLevel = 1 | 2 | 3 | 4 | 5;

export interface UserActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  details: Record<string, any> | null;
  created_at: string;
}
