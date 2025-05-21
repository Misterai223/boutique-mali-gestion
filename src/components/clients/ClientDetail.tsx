
import React from "react";
import { Client } from "@/types/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exportTransactionsToPDF, printTransactionsPDF, ExportableTransaction } from "@/utils/pdfExporter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Printer, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ClientDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onEdit: (client: Client) => void;
}

const ClientDetail = ({ 
  open, 
  onOpenChange, 
  client,
  onEdit
}: ClientDetailProps) => {
  if (!client) return null;

  const totalAmount = client.purchases.reduce((total, purchase) => {
    return total + (purchase.product.price * purchase.quantity);
  }, 0);

  const handleGenerateInvoice = () => {
    const transactions: ExportableTransaction[] = client.purchases.map((purchase, index) => ({
      id: index + 1,
      description: purchase.product.name,
      amount: purchase.product.price * purchase.quantity,
      type: "income",
      date: client.createdAt,
      category: purchase.product.category
    }));

    exportTransactionsToPDF(transactions, `Facture - ${client.fullName}`);
    toast.success("La facture a été générée avec succès");
  };

  const handlePrintInvoice = () => {
    const transactions: ExportableTransaction[] = client.purchases.map((purchase, index) => ({
      id: index + 1,
      description: purchase.product.name,
      amount: purchase.product.price * purchase.quantity,
      type: "income",
      date: client.createdAt,
      category: purchase.product.category
    }));

    printTransactionsPDF(transactions, `Facture - ${client.fullName}`);
    toast.success("Impression de la facture en cours");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-b sticky top-0 z-10 backdrop-blur-sm">
          <DialogTitle className="text-xl flex items-center gap-2">
            {client.fullName}
          </DialogTitle>
          <DialogDescription>
            Client depuis {format(new Date(client.createdAt), "d MMMM yyyy", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Tabs defaultValue="details" className="w-full">
            <div className="px-6 pt-4 border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="purchases">Achats</TabsTrigger>
                <TabsTrigger value="invoice">Facture</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="details" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                    <p className="text-sm"><strong>Téléphone:</strong> {client.phoneNumber}</p>
                    <p className="text-sm"><strong>Email:</strong> {client.email || "Non renseigné"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
                    <p className="text-sm">{client.address || "Non renseignée"}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Historique</h3>
                  <p className="text-sm">
                    <strong>Créé le:</strong> {format(new Date(client.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </p>
                  <p className="text-sm">
                    <strong>Dernière modification:</strong> {format(new Date(client.updatedAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="purchases" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Produits achetés</h3>
                    <Badge variant="outline" className="font-medium">
                      Total: {totalAmount.toLocaleString()} F CFA
                    </Badge>
                  </div>
                  
                  {client.purchases.length > 0 ? (
                    <div className="space-y-3">
                      {client.purchases.map((purchase, index) => (
                        <div key={index} className="flex justify-between p-3 border rounded-md bg-muted/10">
                          <div>
                            <p className="font-medium">{purchase.product.name}</p>
                            <p className="text-xs text-muted-foreground">{purchase.product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{purchase.quantity} x {purchase.product.price.toLocaleString()} F CFA</p>
                            <p className="text-sm font-bold">{(purchase.quantity * purchase.product.price).toLocaleString()} F CFA</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">Aucun produit acheté</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="invoice" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Facture client</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateInvoice}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger la facture (PDF)
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handlePrintInvoice}
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Imprimer la facture
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4 mt-4 bg-muted/10">
                    <h4 className="text-lg font-bold mb-2">Résumé</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 text-muted-foreground">Client:</td>
                          <td className="py-1 text-right font-medium">{client.fullName}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-muted-foreground">Articles:</td>
                          <td className="py-1 text-right font-medium">{client.purchases.length}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-muted-foreground">Quantité totale:</td>
                          <td className="py-1 text-right font-medium">
                            {client.purchases.reduce((sum, purchase) => sum + purchase.quantity, 0)}
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-2 font-medium">Montant total:</td>
                          <td className="py-2 text-right font-bold">
                            {totalAmount.toLocaleString()} F CFA
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
        
        <DialogFooter className="p-6 border-t bg-muted/20 sticky bottom-0 backdrop-blur-sm flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={() => {
              onOpenChange(false);
              onEdit(client);
            }}
          >
            <Edit className="h-4 w-4" />
            Modifier le client
          </Button>
          <Button 
            variant="default"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90"
            onClick={handleGenerateInvoice}
          >
            <FileText className="h-4 w-4" />
            Générer une facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetail;
