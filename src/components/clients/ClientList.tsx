
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ShoppingCart, Eye } from "lucide-react";
import { Client } from "@/types/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onAddPurchase: (client: Client) => void;
}

export default function ClientList({ clients, onEdit, onDelete, onAddPurchase }: ClientListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleClientDetails = (id: string) => {
    setExpandedClient(expandedClient === id ? null : id);
  };

  if (clients.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card shadow-md rounded-xl border border-border/50 p-10 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Aucun client trouvé</h3>
          <p className="text-muted-foreground">Ajoutez un nouveau client pour commencer</p>
        </div>
      </motion.div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // Mobile view with cards
  if (isMobile) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {clients.map((client) => (
          <motion.div
            key={client.id}
            variants={item}
            className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{client.full_name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {client.email && <p>{client.email}</p>}
                    <p>{client.phone}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleClientDetails(client.id)}
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {expandedClient === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <span className="font-medium">Pays:</span>
                    </div>
                    <div>{client.country}</div>
                    
                    <div>
                      <span className="font-medium">Adresse:</span>
                    </div>
                    <div>{client.address}</div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddPurchase(client)}
                      className="w-full justify-start"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Achats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(client)}
                      className="w-full justify-start"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      disabled={deletingId === client.id}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Desktop view with table
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden border shadow-md bg-card"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-medium">Nom</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Téléphone</TableHead>
              <TableHead className="font-medium">Pays</TableHead>
              <TableHead className="font-medium">Adresse</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <motion.tr
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">{client.full_name}</TableCell>
                <TableCell>{client.email || <Badge variant="outline" className="bg-muted/30">Non défini</Badge>}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell className="max-w-[200px] truncate">{client.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAddPurchase(client)}
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Achats</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(client)}
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client.id)}
                        disabled={deletingId === client.id}
                        className="h-8 w-8 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

// Import the Users icon at the beginning of the file
import { Users } from "lucide-react";
