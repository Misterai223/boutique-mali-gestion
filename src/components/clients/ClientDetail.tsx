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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Printer, Edit, Users, Phone, Mail, MapPin, ShoppingBag, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AdvancedPdfGenerator } from "@/utils/advancedPdfGenerator";
import { invoiceSettingsService } from "@/services/invoiceSettingsService";

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

  const handlePreviewInvoice = () => {
    console.log("Previewing invoice for client:", client.fullName);
    try {
      const settings = invoiceSettingsService.getSettings();
      const generator = new AdvancedPdfGenerator(settings);
      const doc = generator.generateClientInvoice(client);
      
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      toast.success("Aperçu de la facture ouvert");
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error("Erreur lors de la génération de l'aperçu");
    }
  };

  const handleGenerateInvoice = () => {
    console.log("Generating invoice for client:", client.fullName);
    try {
      const settings = invoiceSettingsService.getSettings();
      const generator = new AdvancedPdfGenerator(settings);
      const doc = generator.generateClientInvoice(client);
      
      const fileName = `Facture-${client.fullName.replace(/\s+/g, '_')}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      doc.save(fileName);
      
      toast.success("La facture a été générée avec succès");
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error("Erreur lors de la génération de la facture");
    }
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice for client:", client.fullName);
    try {
      const settings = invoiceSettingsService.getSettings();
      const generator = new AdvancedPdfGenerator(settings);
      const doc = generator.generateClientInvoice(client);
      
      const dataUri = doc.output('dataurlstring');
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe width='100%' height='100%' src='${dataUri}'></iframe>`);
        newWindow.document.close();
        newWindow.focus();
        setTimeout(() => {
          newWindow.print();
        }, 250);
      }
      
      toast.success("Impression de la facture en cours");
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error("Erreur lors de l'impression");
    }
  };

  const handleEditClient = () => {
    console.log("Edit button clicked in detail modal for:", client.fullName);
    onOpenChange(false);
    setTimeout(() => {
      onEdit(client);
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[90vh] bg-gradient-to-br from-background to-muted/20">
        {/* Enhanced Header */}
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl"
            >
              <Users className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {client.fullName}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Client depuis {format(new Date(client.createdAt), "d MMMM yyyy", { locale: fr })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <Tabs defaultValue="details" className="w-full">
            <div className="px-6 pt-4 border-b bg-muted/10">
              <TabsList className="w-full justify-start h-12 bg-background/50 backdrop-blur-sm">
                <TabsTrigger value="details" className="px-6 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Détails
                </TabsTrigger>
                <TabsTrigger value="purchases" className="px-6 py-2">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Achats
                </TabsTrigger>
                <TabsTrigger value="invoice" className="px-6 py-2">
                  <FileText className="h-4 w-4 mr-2" />
                  Facture
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="details" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Informations de contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Téléphone</p>
                          <p className="font-medium">{client.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Mail className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{client.email || "Non renseigné"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Address Information */}
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Adresse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-sm leading-relaxed">
                          {client.address || "Adresse non renseignée"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Timeline Information */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Historique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">Compte créé</span>
                      <span className="font-medium">
                        {format(new Date(client.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">Dernière modification</span>
                      <span className="font-medium">
                        {format(new Date(client.updatedAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="purchases" className="mt-0">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        Produits achetés
                      </CardTitle>
                      <Badge variant="outline" className="text-lg px-4 py-2 font-bold bg-primary/10 border-primary/20">
                        Total: {totalAmount.toLocaleString()} F CFA
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {client.purchases.length > 0 ? (
                      <div className="space-y-4">
                        {client.purchases.map((purchase, index) => (
                          <motion.div 
                            key={index} 
                            className="flex justify-between items-center p-4 border rounded-xl bg-gradient-to-r from-muted/20 to-muted/10 hover:from-muted/30 hover:to-muted/20 transition-all duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <ShoppingBag className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">{purchase.product.name}</p>
                                <p className="text-sm text-muted-foreground">{purchase.product.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {purchase.quantity} × {purchase.product.price.toLocaleString()} F CFA
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {(purchase.quantity * purchase.product.price).toLocaleString()} F CFA
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground text-lg">Aucun produit acheté</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoice" className="mt-0">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      Facture client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={handlePreviewInvoice}
                          className="w-full h-12 text-base group border-2"
                        >
                          <Eye className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                          Aperçu
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={handleGenerateInvoice}
                          className="w-full h-12 text-base group border-2"
                        >
                          <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                          Télécharger
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={handlePrintInvoice}
                          className="w-full h-12 text-base group border-2"
                        >
                          <Printer className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                          Imprimer
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                      <h4 className="text-2xl font-bold mb-4 text-center">Résumé de facturation</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-primary/20">
                          <span className="text-muted-foreground">Client</span>
                          <span className="font-semibold">{client.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-primary/20">
                          <span className="text-muted-foreground">Nombre d'articles</span>
                          <span className="font-semibold">{client.purchases.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-primary/20">
                          <span className="text-muted-foreground">Quantité totale</span>
                          <span className="font-semibold">
                            {client.purchases.reduce((sum, purchase) => sum + purchase.quantity, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t-2 border-primary/30">
                          <span className="text-lg font-semibold">Montant total</span>
                          <span className="text-2xl font-bold text-primary">
                            {totalAmount.toLocaleString()} F CFA
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
        
        <DialogFooter className="p-6 border-t bg-gradient-to-r from-muted/20 to-muted/10 backdrop-blur-sm sticky bottom-0 flex-wrap gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11">
            Fermer
          </Button>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="default"
              className="h-11 bg-gradient-to-r from-secondary to-secondary/80"
              onClick={handleEditClient}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier le client
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="default"
              className="h-11 bg-gradient-to-r from-primary to-primary/80 shadow-lg"
              onClick={handleGenerateInvoice}
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer une facture
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetail;
