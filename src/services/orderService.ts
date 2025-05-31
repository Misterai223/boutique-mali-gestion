
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, CreateOrderData, CreateOrderItemData } from "@/types/order";

export const orderService = {
  // Récupérer toutes les commandes avec détails
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        clients(full_name),
        employees(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }

    return data || [];
  },

  // Récupérer une commande par ID avec ses détails
  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        clients(*),
        employees(full_name),
        order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }

    return data;
  },

  // Créer une nouvelle commande
  async createOrder(orderData: CreateOrderData, items: CreateOrderItemData[]): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Erreur lors de la création de la commande:', orderError);
      throw orderError;
    }

    // Ajouter les items à la commande
    const itemsWithOrderId = items.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error('Erreur lors de l\'ajout des items:', itemsError);
      throw itemsError;
    }

    return order;
  },

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['payment_status']): Promise<Order> {
    const updateData: any = { status };
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }

    return data;
  },

  // Récupérer les items d'une commande
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      console.error('Erreur lors de la récupération des items:', error);
      throw error;
    }

    return data || [];
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
  }
};
