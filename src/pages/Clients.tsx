
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Client, ClientWithPurchases, CreateClientData, UpdateClientData, CreatePurchaseData } from "@/types/client";
import { getClients, createClient, updateClient, deleteClient } from "@/services/clientService";
import { addClientPurchase, deleteClientPurchase } from "@/services/clientPurchaseService";
import ClientList from "@/components/clients/ClientList";
import ClientForm from "@/components/clients/ClientForm";
import ClientSearchFilter from "@/components/clients/ClientSearchFilter";
import PurchaseForm from "@/components/clients/PurchaseForm";
import PurchaseList from "@/components/clients/PurchaseList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientWithPurchases | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const clientsData = await getClients();
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.full_name.toLowerCase().includes(term) ||
          (client.email && client.email.toLowerCase().includes(term)) ||
          client.phone.toLowerCase().includes(term) ||
          client.country.toLowerCase().includes(term) ||
          client.address.toLowerCase().includes(term)
      );
      setFilteredClients(filtered);
    }
  }, [clients, searchTerm]);

  const handleAddClient = () => {
    setCurrentClient(undefined);
    setIsClientDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client as ClientWithPurchases);
    setIsClientDialogOpen(true);
  };

  const handleAddPurchase = (client: Client) => {
    setCurrentClient(client as ClientWithPurchases);
    setIsPurchaseDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((client) => client.id !== id));
      toast({
        title: "Succès",
        description: "Client supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce client",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeletePurchase = async (purchaseId: string) => {
    try {
      await deleteClientPurchase(purchaseId);
      
      if (currentClient) {
        setCurrentClient({
          ...currentClient,
          purchases: currentClient.purchases?.filter(p => p.id !== purchaseId)
        });
      }
      
      toast({
        title: "Succès",
        description: "Achat supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet achat",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleSubmitClient = async (data: CreateClientData) => {
    setIsSubmitting(true);
    try {
      if (currentClient) {
        // Mise à jour d'un client existant
        const updatedClient = await updateClient({
          id: currentClient.id,
          ...data,
        });
        setClients((prev) =>
          prev.map((c) => (c.id === currentClient.id ? updatedClient : c))
        );
        toast({
          title: "Succès",
          description: "Client modifié avec succès",
        });
      } else {
        // Création d'un nouveau client
        const newClient = await createClient(data);
        setClients((prev) => [newClient, ...prev]);
        toast({
          title: "Succès",
          description: "Client ajouté avec succès",
        });
      }
      setIsClientDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: currentClient
          ? "Impossible de modifier ce client"
          : "Impossible d'ajouter ce client",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPurchase = async (data: CreatePurchaseData) => {
    setIsSubmitting(true);
    try {
      const newPurchase = await addClientPurchase(data);
      
      if (currentClient) {
        // Mettre à jour la liste des achats du client
        const updatedPurchases = currentClient.purchases ? [...currentClient.purchases, newPurchase] : [newPurchase];
        setCurrentClient({
          ...currentClient,
          purchases: updatedPurchases
        });
      }
      
      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });
      
      // Ne pas fermer le dialogue pour permettre d'ajouter plusieurs produits
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce produit",
        variant: "destructive",
      });
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Clients</h1>
        <Button onClick={handleAddClient}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      <ClientSearchFilter onSearch={handleSearch} count={filteredClients.length} />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ClientList
          clients={filteredClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onAddPurchase={handleAddPurchase}
        />
      )}

      {/* Dialogue pour ajouter/modifier un client */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentClient ? "Modifier un client" : "Ajouter un client"}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            initialData={currentClient}
            onSubmit={handleSubmitClient}
            onCancel={() => setIsClientDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue pour ajouter un achat */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Produits achetés par {currentClient?.full_name}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add">Ajouter un produit</TabsTrigger>
              <TabsTrigger value="list">Liste des produits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="mt-4">
              {currentClient && (
                <PurchaseForm
                  clientId={currentClient.id}
                  onSubmit={handleSubmitPurchase}
                  onCancel={() => setIsPurchaseDialogOpen(false)}
                  isSubmitting={isSubmitting}
                />
              )}
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              {currentClient && currentClient.purchases && (
                <PurchaseList
                  purchases={currentClient.purchases}
                  onDelete={handleDeletePurchase}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
