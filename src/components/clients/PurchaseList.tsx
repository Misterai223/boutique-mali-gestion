
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

interface PurchaseListProps {
  purchases: ClientPurchase[];
  onDelete: (id: string) => Promise<void>;
}

export default function PurchaseList({ purchases, onDelete }: PurchaseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <div className="rounded-md border overflow-hidden">
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
  );
}
