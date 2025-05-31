
import { supabase } from "@/integrations/supabase/client";
import { Client, CreateClientData, UpdateClientData } from "@/types/client";

export const clientService = {
  // Récupérer tous les clients
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('full_name');

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }

    return data || [];
  },

  // Récupérer un client par ID
  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du client:', error);
      throw error;
    }

    return data;
  },

  // Créer un nouveau client
  async createClient(clientData: CreateClientData): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du client:', error);
      throw error;
    }

    return data;
  },

  // Mettre à jour un client
  async updateClient(id: string, clientData: UpdateClientData): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      throw error;
    }

    return data;
  },

  // Supprimer un client
  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du client:', error);
      throw error;
    }
  },

  // Rechercher des clients
  async searchClients(query: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('full_name');

    if (error) {
      console.error('Erreur lors de la recherche de clients:', error);
      throw error;
    }

    return data || [];
  }
};
