
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

export interface ClientPurchase {
  id: string;
  client_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_date: string;
}

export interface ClientWithPurchases extends Client {
  purchases: ClientPurchase[];
}

export type CreateClientData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type UpdateClientData = Partial<CreateClientData>;
