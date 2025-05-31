
import { supabase } from "@/integrations/supabase/client";
import { Transaction, CreateTransactionData, UpdateTransactionData } from "@/types/transaction";

export const transactionService = {
  // Récupérer toutes les transactions
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles(full_name)
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
    }

    // Cast the type to proper union type
    return (data || []).map(transaction => ({
      ...transaction,
      type: transaction.type as Transaction['type']
    }));
  },

  // Récupérer une transaction par ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la transaction:', error);
      throw error;
    }

    return data ? {
      ...data,
      type: data.type as Transaction['type']
    } : null;
  },

  // Créer une nouvelle transaction
  async createTransaction(transactionData: CreateTransactionData): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      throw error;
    }

    return {
      ...data,
      type: data.type as Transaction['type']
    };
  },

  // Mettre à jour une transaction
  async updateTransaction(id: string, transactionData: UpdateTransactionData): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transactionData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
      throw error;
    }

    return {
      ...data,
      type: data.type as Transaction['type']
    };
  },

  // Supprimer une transaction
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
      throw error;
    }
  },

  // Récupérer les statistiques financières
  async getFinancialStats(startDate?: string, endDate?: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  }> {
    let query = supabase
      .from('transactions')
      .select('type, amount');

    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }

    const totalIncome = data
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const totalExpenses = data
      ?.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses
    };
  }
};
