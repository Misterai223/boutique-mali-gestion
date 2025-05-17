
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const clientsData = await getClients();
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (error) {
      toast.error("Impossible de charger la liste des clients");
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
      toast.success("Client supprimé avec succès");
    } catch (error) {
      toast.error("Impossible de supprimer ce client");
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
      
      toast.success("Achat supprimé avec succès");
    } catch (error) {
      toast.error("Impossible de supprimer cet achat");
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
        toast.success("Client modifié avec succès");
      } else {
        // Création d'un nouveau client
        const newClient = await createClient(data);
        setClients((prev) => [newClient, ...prev]);
        toast.success("Client ajouté avec succès");
      }
      setIsClientDialogOpen(false);
    } catch (error) {
      toast.error(currentClient ? "Impossible de modifier ce client" : "Impossible d'ajouter ce client");
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
        const updatedPurchases = currentClient.purchases ? [...currentClient.purchases, newPurchase] : [newPurchase];
        setCurrentClient({
          ...currentClient,
          purchases: updatedPurchases
        });
      }
      
      toast.success("Produit ajouté avec succès");
      
      // Ne pas fermer le dialogue pour permettre d'ajouter plusieurs produits
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Impossible d'ajouter ce produit");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto py-6 space-y-6"
    >
      {/* En-tête de la page avec titre et bouton d'ajout */}
      <motion.div 
        variants={fadeIn}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Gestion des Clients
          </h1>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleAddClient} 
            size="lg"
            className="shadow-md rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ajouter un client
          </Button>
        </motion.div>
      </motion.div>

      <motion.div variants={fadeIn} className="bg-card rounded-xl shadow-md p-6 border">
        <ClientSearchFilter onSearch={handleSearch} count={filteredClients.length} />
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 space-y-4"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">Chargement des clients...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ClientList
              clients={filteredClients}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onAddPurchase={handleAddPurchase}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue pour ajouter/modifier un client */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card/90 backdrop-blur-sm border border-primary/20 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
        <DialogContent className="sm:max-w-[700px] bg-card/90 backdrop-blur-sm border border-primary/20 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Produits achetés par {currentClient?.full_name}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-lg mb-4">
              <TabsTrigger value="add" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Ajouter un produit
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Liste des produits
              </TabsTrigger>
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
    </motion.div>
  );
}
