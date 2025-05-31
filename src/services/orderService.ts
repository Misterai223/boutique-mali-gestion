import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, CreateOrderData, CreateOrderItemData } from "@/types/order";

export const orderService = {
  // Récupérer toutes les commandes
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        clients(full_name, phone, email),
        employees(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }

    // Cast the status and payment_status to proper types
    return (data || []).map(order => ({
      ...order,
      status: order.status as Order['status'],
      payment_status: order.payment_status as Order['payment_status']
    }));
  },

  // Récupérer une commande par ID avec ses articles
  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        clients(full_name, phone, email),
        employees(full_name),
        order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }

    if (!data) return null;

    // Cast the status and payment_status to proper types
    return {
      ...data,
      status: data.status as Order['status'],
      payment_status: data.payment_status as Order['payment_status']
    };
  },

  // Créer une nouvelle commande
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    // Generate order number if not provided
    const orderToCreate = {
      ...orderData,
      order_number: orderData.order_number || `CMD-${Date.now()}`
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderToCreate)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Order['status'],
      payment_status: data.payment_status as Order['payment_status']
    };
  },

  // Mettre à jour une commande
  async updateOrder(id: string, orderData: Partial<CreateOrderData>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Order['status'],
      payment_status: data.payment_status as Order['payment_status']
    };
  },

  // Supprimer une commande
  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      throw error;
    }
  },

  // Ajouter un article à une commande
  async addOrderItem(itemData: CreateOrderItemData): Promise<OrderItem> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(itemData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      throw error;
    }

    return data;
  },

  // Mettre à jour un article de commande
  async updateOrderItem(id: string, itemData: Partial<CreateOrderItemData>): Promise<OrderItem> {
    const { data, error } = await supabase
      .from('order_items')
      .update(itemData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      throw error;
    }

    return data;
  },

  // Supprimer un article de commande
  async removeOrderItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      throw error;
    }
  },

  // Récupérer les articles d'une commande
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      throw error;
    }

    return data || [];
  }
};
