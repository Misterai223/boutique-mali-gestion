
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

// Legacy type for compatibility with existing components
export interface PurchasedProduct {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
  quantity: number;
}

export type CreateClientData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type UpdateClientData = Partial<CreateClientData>;
