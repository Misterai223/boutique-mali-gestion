
export interface Client {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export type CreateClientData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type UpdateClientData = Partial<CreateClientData>;
