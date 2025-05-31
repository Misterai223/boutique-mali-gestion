
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  payment_method: string | null;
  created_by: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export type CreateTransactionData = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTransactionData = Partial<CreateTransactionData>;
