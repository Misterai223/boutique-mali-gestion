
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ClientPurchase } from "@/types/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface PurchaseListProps {
  purchases: ClientPurchase[];
  onDelete: (id: string) => Promise<void>;
}

export default function PurchaseList({ purchases, onDelete }: PurchaseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucun produit acheté.</p>
      </div>
    );
  }

  // Formatage des dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Formatage des prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Version mobile avec des cartes au lieu d'un tableau
  if (isMobile) {
    return (
      <div className="space-y-3">
        {purchases.map((purchase) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-lg border p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{purchase.product_name}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>Quantité:</span>
                    <span className="font-medium">{purchase.quantity}</span>
                    
                    <span>Prix unitaire:</span>
                    <span className="font-medium">{formatPrice(purchase.price)}</span>
                    
                    <span>Total:</span>
                    <span className="font-medium">{formatPrice(purchase.price * purchase.quantity)}</span>
                    
                    <span>Date d'achat:</span>
                    <span className="font-medium">{formatDate(purchase.purchase_date)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(purchase.id)}
                disabled={deletingId === purchase.id}
                className="flex-shrink-0 h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Version bureau avec tableau complet
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Prix unitaire</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date d'achat</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.product_name}</TableCell>
                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>{formatPrice(purchase.price)}</TableCell>
                <TableCell>{formatPrice(purchase.price * purchase.quantity)}</TableCell>
                <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(purchase.id)}
                    disabled={deletingId === purchase.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
