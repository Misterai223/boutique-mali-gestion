import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, User, Search, Filter, Users as UsersIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Client } from "@/types/client";
import { ProductWithCategory } from "@/types/product";
import ClientForm from "@/components/clients/ClientForm";
import ClientCard from "@/components/clients/ClientCard";
import ClientDetail from "@/components/clients/ClientDetail";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample products data
const sampleProducts: ProductWithCategory[] = [
  {
    id: "1",
    name: "iPhone 13",
    category_id: "cat1",
    price: 350000,
    stock_quantity: 15,
    threshold: 5,
    description: "Un smartphone haut de gamme avec d'excellentes performances",
    image_url: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat1", name: "Téléphones", slug: "telephones" }
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    category_id: "cat1",
    price: 280000,
    stock_quantity: 3,
    threshold: 5,
    description: "Un smartphone puissant avec un excellent appareil photo",
    image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat1", name: "Téléphones", slug: "telephones" }
  },
  {
    id: "3",
    name: "Écouteurs Bluetooth",
    category_id: "cat2",
    price: 25000,
    stock_quantity: 5,
    threshold: 10,
    description: "Écouteurs sans fil avec réduction de bruit",
    image_url: "https://images.unsplash.com/photo-1606400082777-ef05f3c5e084?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat2", name: "Accessoires", slug: "accessoires" }
  },
];

// Sample clients data
const sampleClients: Client[] = [
  {
    id: "1",
    full_name: "Jean Dupont",
    phone: "+225 01 23 45 67 89",
    address: "Abidjan Cocody, Rue des Jardins",
    email: "jean.dupont@example.com",
    country: "Côte d'Ivoire",
    created_at: "2023-10-15T10:30:00Z",
    updated_at: "2023-10-15T10:30:00Z"
  },
  {
    id: "2",
    full_name: "Marie Kouassi",
    phone: "+225 07 89 01 23 45",
    address: "Abidjan Plateau, Avenue de la République",
    email: "marie.k@example.com",
    country: "Côte d'Ivoire",
    created_at: "2023-11-05T14:20:00Z",
    updated_at: "2023-11-05T14:20:00Z"
  }
];

const Users = () => {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
  const [products] = useState<ProductWithCategory[]>(sampleProducts);

  // Filtered clients based on search term
  const filteredClients = clients.filter(client => {
    return (
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
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
      toast.success(`Client "${client.full_name}" mis à jour avec succès!`);
    } else {
      // Add new client
      setClients([...clients, client]);
      toast.success(`Client "${client.full_name}" ajouté avec succès!`);
    }
    setCurrentClient(undefined);
    setFormOpen(false);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const headerVariants = {
    initial: { y: -30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  const searchVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4 } }
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
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 20
      } 
    },
    hover: { 
      y: -10, 
      scale: 1.02, 
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    },
    tap: { 
      scale: 0.98, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        variants={headerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold tracking-tight flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <UsersIcon className="h-8 w-8 text-primary" />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Gestion des Clients
          </motion.span>
        </motion.h1>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            onClick={handleAddClient} 
            className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Plus className="h-4 w-4 mr-2" />
            </motion.div>
            Ajouter un client
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4"
        variants={searchVariants}
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

      <ScrollArea className="h-[calc(100vh-220px)] w-full pr-4">
        {filteredClients.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                custom={index}
                transition={{ delay: index * 0.1 }}
                className="transform-gpu"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.3
              }}
            >
              <User className="h-16 w-16 mx-auto text-muted-foreground/60" />
            </motion.div>
            <motion.p 
              className="text-muted-foreground mt-4 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Aucun client trouvé
            </motion.p>
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => setSearchTerm("")} 
                  variant="link" 
                  className="mt-2"
                >
                  Réinitialiser la recherche
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </ScrollArea>

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
