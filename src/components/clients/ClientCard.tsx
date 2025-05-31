
import { Client } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Edit, MapPin, Phone, Mail, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
}

const ClientCard = ({ client, onView, onEdit }: ClientCardProps) => {
  // Mock purchases calculation for now - will be replaced with real data from orders
  const totalAmount = 0; // client.purchases?.reduce((total, purchase) => total + (purchase.product.price * purchase.quantity), 0) || 0;
  const purchaseCount = 0; // client.purchases?.length || 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked for client:", client.full_name);
    onEdit(client);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("View button clicked for client:", client.full_name);
    onView(client);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-0 relative z-10">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl shadow-sm">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2, opacity: 0.3 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {client.full_name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Depuis {format(new Date(client.created_at), "MMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm group/item hover:text-primary transition-colors duration-200">
                <Phone className="h-4 w-4 text-muted-foreground group-hover/item:text-primary" />
                <span className="font-medium">{client.phone}</span>
              </div>
              
              {client.email && (
                <div className="flex items-center gap-2 text-sm group/item hover:text-primary transition-colors duration-200">
                  <Mail className="h-4 w-4 text-muted-foreground group-hover/item:text-primary" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              
              {client.address && (
                <div className="flex items-start gap-2 text-sm group/item hover:text-primary transition-colors duration-200">
                  <MapPin className="h-4 w-4 text-muted-foreground group-hover/item:text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground line-clamp-2">{client.address}</span>
                </div>
              )}
            </div>

            {/* Purchase Summary */}
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Achats</span>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {purchaseCount} produit(s)
                  </span>
                  <span className="font-bold text-primary">
                    {totalAmount.toLocaleString()} F CFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="flex justify-between p-4 bg-muted/20 border-t border-border/50 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleEdit}
              className="group/btn text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
            >
              <Edit className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-200" />
              Modifier
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="group/btn text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
              Détails
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ClientCard;
