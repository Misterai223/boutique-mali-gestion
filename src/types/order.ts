
export interface Order {
  id: string;
  order_number: string;
  client_id: string | null;
  employee_id: string | null;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  payment_method: string | null;
  notes: string | null;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// For creating orders, we don't include order_number as it's auto-generated
export type CreateOrderData = Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>;
export type UpdateOrderData = Partial<CreateOrderData>;

export type CreateOrderItemData = Omit<OrderItem, 'id' | 'created_at'>;
