
export interface Client {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  country: string;
  address: string;
  created_at: string;
}

export interface CreateClientData {
  full_name: string;
  email?: string;
  phone: string;
  country: string;
  address: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}
