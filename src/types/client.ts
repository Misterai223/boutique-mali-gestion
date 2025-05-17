
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

export interface ClientPurchase {
  id: string;
  client_id: string;
  product_name: string;
  purchase_date: string;
  quantity: number;
  price: number;
}

export interface CreatePurchaseData {
  client_id: string;
  product_name: string;
  quantity?: number;
  price: number;
  purchase_date?: string;
}

export interface ClientWithPurchases extends Client {
  purchases?: ClientPurchase[];
}
