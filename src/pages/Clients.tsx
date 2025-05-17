
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Client, CreateClientData, UpdateClientData } from "@/types/client";
import { getClients, createClient, updateClient, deleteClient } from "@/services/clientService";
import ClientList from "@/components/clients/ClientList";
import ClientForm from "@/components/clients/ClientForm";
import ClientSearchFilter from "@/components/clients/ClientSearchFilter";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
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
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsDialogOpen(true);
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
      setIsDialogOpen(false);
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
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentClient ? "Modifier un client" : "Ajouter un client"}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            initialData={currentClient}
            onSubmit={handleSubmitClient}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
