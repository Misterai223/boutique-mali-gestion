
import { Client } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Edit } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
}

const ClientCard = ({ client, onView, onEdit }: ClientCardProps) => {
  const totalAmount = client.purchases.reduce((total, purchase) => {
    return total + (purchase.product.price * purchase.quantity);
  }, 0);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">{client.fullName}</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(client.createdAt), "d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Téléphone</p>
              <p>{client.phoneNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="truncate">{client.email || "Non renseigné"}</p>
            </div>
          </div>

          <div className="text-sm">
            <p className="text-muted-foreground text-xs">Achats</p>
            <p><strong>{client.purchases.length}</strong> produit(s) pour un total de <strong>{totalAmount.toLocaleString()} F CFA</strong></p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-3 bg-muted/10 border-t">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEdit(client)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => onView(client)}
          className="text-primary hover:text-primary/80"
        >
          <FileText className="h-4 w-4 mr-1" />
          Détails
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
