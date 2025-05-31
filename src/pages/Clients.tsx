
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, User, Search, Users as UsersIcon, Filter, SortAsc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Client } from "@/types/client";
import { Product } from "@/types/product";
import ClientForm from "@/components/clients/ClientForm";
import ClientCard from "@/components/clients/ClientCard";
import ClientDetail from "@/components/clients/ClientDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

// Sample products data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 13",
    description: "Un smartphone haut de gamme avec d'excellentes performances",
    price: 350000,
    stock_quantity: 15,
    threshold: 5,
    category_id: "1",
    image_url: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&h=400&fit=crop",
    sku: "IPH13-128",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    description: "Un smartphone puissant avec un excellent appareil photo",
    price: 280000,
    stock_quantity: 3,
    threshold: 5,
    category_id: "1",
    image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    sku: "SGS21-256",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Écouteurs Bluetooth",
    description: "Écouteurs sans fil avec réduction de bruit",
    price: 25000,
    stock_quantity: 5,
    threshold: 10,
    category_id: "2",
    image_url: "https://images.unsplash.com/photo-1606400082777-ef05f3c5e084?w=400&h=400&fit=crop",
    sku: "BT-EARBUDS",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
  const [products] = useState<Product[]>(sampleProducts);
  const [isLoading, setIsLoading] = useState(false);

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
    console.log("Editing client:", client);
    setCurrentClient(client);
    setFormOpen(true);
  };

  const handleViewClient = (client: Client) => {
    console.log("Viewing client:", client);
    setCurrentClient(client);
    setDetailOpen(true);
  };

  const handleSaveClient = (client: Client) => {
    setIsLoading(true);
    setTimeout(() => {
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
      setIsLoading(false);
    }, 500);
  };

  // Advanced animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  };
  
  const headerVariants = {
    initial: { opacity: 0, y: -30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.7, 
        delay: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    }
  };
  
  const searchVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.4,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 25,
        duration: 0.6
      } 
    },
    hover: { 
      y: -8, 
      scale: 1.03, 
      rotateY: 2,
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 18 
      }
    },
    tap: { 
      scale: 0.97, 
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      } 
    }
  };

  const floatingElementVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.8
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 space-y-8 p-6 pb-16">
        {/* Enhanced Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <motion.div className="space-y-2">
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold tracking-tight flex items-center gap-3 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="relative"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.3 
                }}
                whileHover={{ 
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <UsersIcon className="h-10 w-10 lg:h-12 lg:w-12 text-primary drop-shadow-sm" />
                <motion.div
                  className="absolute inset-0 h-10 w-10 lg:h-12 lg:w-12 bg-primary/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Gestion des Clients
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Gérez facilement votre portefeuille client
            </motion.p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline"
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Filtres
                <motion.div
                  className="absolute inset-0 bg-primary/5"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleAddClient} 
                className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                disabled={isLoading}
              >
                <motion.div
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                </motion.div>
                Nouveau client
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Search Section */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  placeholder="Rechercher par nom, téléphone ou email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-12 h-12 text-lg border-2 focus:border-primary/50 transition-all duration-300 bg-background/50"
                />
                <motion.div
                  className="absolute inset-0 rounded-md border-2 border-primary/20"
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileFocus={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="h-12 border-2">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Trier
                </Button>
              </div>
            </div>
            
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <p className="text-sm text-muted-foreground">
                  {filteredClients.length} résultat(s) trouvé(s) pour "{searchTerm}"
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Enhanced Content Area */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.8
          }}
        >
          <ScrollArea className="h-[calc(100vh-320px)] pr-4">
            <AnimatePresence mode="wait">
              {filteredClients.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.08, delayChildren: 0.4 }}
                  key="clients-grid"
                >
                  {filteredClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                      whileHover={{ y: -8, scale: 1.03, rotateY: 2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        damping: 25,
                        delay: index * 0.1
                      }}
                      layout
                      className="transform-gpu perspective-1000"
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
                  className="flex flex-col items-center justify-center py-20"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key="empty-state"
                >
                  <Card className="p-12 text-center max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        delay: 0.2
                      }}
                      className="mb-6"
                    >
                      <User className="h-20 w-20 mx-auto text-muted-foreground/60" />
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-semibold mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Aucun client trouvé
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {searchTerm 
                        ? "Essayez de modifier votre recherche" 
                        : "Commencez par ajouter votre premier client"
                      }
                    </motion.p>
                    {searchTerm ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button 
                          onClick={() => setSearchTerm("")} 
                          variant="outline"
                          className="group"
                        >
                          Réinitialiser la recherche
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 1, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            →
                          </motion.div>
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button 
                          onClick={handleAddClient}
                          className="group bg-gradient-to-r from-primary to-secondary"
                        >
                          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                          Ajouter votre premier client
                        </Button>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </motion.div>
      </div>

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

export default Clients;
