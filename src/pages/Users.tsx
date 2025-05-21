
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, User, Search, Filter, Users as UsersIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Client } from "@/types/client";
import { Product } from "@/types/product";
import ClientForm from "@/components/clients/ClientForm";
import ClientCard from "@/components/clients/ClientCard";
import ClientDetail from "@/components/clients/ClientDetail";

// Sample products data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 13",
    category: "Téléphones",
    price: 350000,
    stockQuantity: 15,
    threshold: 5,
    description: "Un smartphone haut de gamme avec d'excellentes performances",
    imageUrl: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    category: "Téléphones",
    price: 280000,
    stockQuantity: 3,
    threshold: 5,
    description: "Un smartphone puissant avec un excellent appareil photo",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Écouteurs Bluetooth",
    category: "Accessoires",
    price: 25000,
    stockQuantity: 5,
    threshold: 10,
    description: "Écouteurs sans fil avec réduction de bruit",
    imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5e084?w=400&h=400&fit=crop",
  },
];

// Sample clients data
const sampleClients: Client[] = [
  {
    id: "1",
    fullName: "Jean Dupont",
    phoneNumber: "+225 01 23 45 67 89",
    address: "Abidjan Cocody, Rue des Jardins",
    email: "jean.dupont@example.com",
    purchases: [
      {
        product: sampleProducts[0],
        quantity: 1
      },
      {
        product: sampleProducts[2],
        quantity: 2
      }
    ],
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "2",
    fullName: "Marie Kouassi",
    phoneNumber: "+225 07 89 01 23 45",
    address: "Abidjan Plateau, Avenue de la République",
    email: "marie.k@example.com",
    purchases: [
      {
        product: sampleProducts[1],
        quantity: 1
      }
    ],
    createdAt: "2023-11-05T14:20:00Z",
    updatedAt: "2023-11-05T14:20:00Z"
  }
];

const Users = () => {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
  const [products] = useState<Product[]>(sampleProducts);

  // Filtered clients based on search term
  const filteredClients = clients.filter(client => {
    return (
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phoneNumber.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddClient = () => {
    setCurrentClient(undefined);
    setFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setFormOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setCurrentClient(client);
    setDetailOpen(true);
  };

  const handleSaveClient = (client: Client) => {
    if (currentClient) {
      // Edit existing client
      setClients(
        clients.map((c) => (c.id === client.id ? client : c))
      );
      toast.success(`Client "${client.fullName}" mis à jour avec succès!`);
    } else {
      // Add new client
      setClients([...clients, client]);
      toast.success(`Client "${client.fullName}" ajouté avec succès!`);
    }
    setCurrentClient(undefined);
    setFormOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UsersIcon className="h-8 w-8 text-primary" />
          Clients
        </h1>
        <Button 
          onClick={handleAddClient} 
          className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un client
        </Button>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4"
        variants={itemVariants}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client par nom ou numéro..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 shadow-sm border-input/60 focus-visible:ring-primary/30"
          />
        </div>
      </motion.div>

      {filteredClients.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ClientCard
                client={client}
                onView={handleViewClient}
                onEdit={handleEditClient}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16 bg-muted/30 rounded-lg border border-dashed"
          variants={itemVariants}
        >
          <User className="h-16 w-16 mx-auto text-muted-foreground/60" />
          <p className="text-muted-foreground mt-4 text-lg">Aucun client trouvé</p>
          {searchTerm && (
            <Button 
              onClick={() => setSearchTerm("")} 
              variant="link" 
              className="mt-2"
            >
              Réinitialiser la recherche
            </Button>
          )}
        </motion.div>
      )}

      {/* Formulaire d'ajout/modification de client */}
      <ClientForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={currentClient}
        onSave={handleSaveClient}
        products={products}
      />

      {/* Détails du client */}
      <ClientDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        client={currentClient}
        onEdit={(client) => {
          setDetailOpen(false);
          setTimeout(() => handleEditClient(client), 100);
        }}
      />
    </motion.div>
  );
};

export default Users;
