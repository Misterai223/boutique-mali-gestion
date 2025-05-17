
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Client, CreateClientData, UpdateClientData } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Fonction pour récupérer tous les clients
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  return data as Client[];
};

// Fonction pour récupérer un client spécifique
export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw error;
  }

  return data as Client | null;
};

// Fonction pour créer un client
export const createClient = async (clientData: CreateClientData): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création du client:", error);
    throw error;
  }

  return data as Client;
};

// Fonction pour mettre à jour un client
export const updateClient = async (clientData: UpdateClientData): Promise<Client> => {
  const { id, ...updateData } = clientData;
  
  const { data, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    throw error;
  }

  return data as Client;
};

// Fonction pour supprimer un client
export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw error;
  }
};
