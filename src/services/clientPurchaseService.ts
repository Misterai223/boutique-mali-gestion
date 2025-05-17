
import { ClientPurchase, CreatePurchaseData } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Fonction pour récupérer tous les achats d'un client
export const getClientPurchases = async (clientId: string): Promise<ClientPurchase[]> => {
  const { data, error } = await supabase
    .from('client_purchases')
    .select('*')
    .eq('client_id', clientId)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des achats du client:", error);
    throw error;
  }

  return data as ClientPurchase[];
};

// Fonction pour ajouter un achat à un client
export const addClientPurchase = async (purchaseData: CreatePurchaseData): Promise<ClientPurchase> => {
  const { data, error } = await supabase
    .from('client_purchases')
    .insert([purchaseData])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout d'un achat pour le client:", error);
    throw error;
  }

  return data as ClientPurchase;
};

// Fonction pour supprimer un achat
export const deleteClientPurchase = async (purchaseId: string): Promise<void> => {
  const { error } = await supabase
    .from('client_purchases')
    .delete()
    .eq('id', purchaseId);

  if (error) {
    console.error("Erreur lors de la suppression de l'achat:", error);
    throw error;
  }
};
