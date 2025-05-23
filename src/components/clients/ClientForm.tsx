
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client, PurchasedProduct } from "@/types/client";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Save, X, Plus, Minus } from "lucide-react";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Client;
  onSave: (client: Client) => void;
  products: Product[];
}

const ClientForm = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  products
}: ClientFormProps) => {
  const [formData, setFormData] = useState<Client>({
    id: Date.now().toString(),
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
    purchases: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (initialData) {
      setFormData({...initialData});
    } else if (open) {
      setFormData({
        id: Date.now().toString(),
        fullName: "",
        phoneNumber: "",
        address: "",
        email: "",
        purchases: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [initialData, open]);

  const isEditing = !!initialData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddPurchase = () => {
    if (products.length === 0) {
      toast.error("Aucun produit disponible");
      return;
    }
    
    setFormData({
      ...formData,
      purchases: [
        ...formData.purchases,
        { 
          product: products[0], 
          quantity: 1 
        }
      ]
    });
  };

  const handleRemovePurchase = (index: number) => {
    const newPurchases = [...formData.purchases];
    newPurchases.splice(index, 1);
    
    setFormData({
      ...formData,
      purchases: newPurchases
    });
  };

  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    
    if (!selectedProduct) return;
    
    const newPurchases = [...formData.purchases];
    newPurchases[index] = {
      ...newPurchases[index],
      product: selectedProduct
    };
    
    setFormData({
      ...formData,
      purchases: newPurchases
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newPurchases = [...formData.purchases];
    
    newPurchases[index] = {
      ...newPurchases[index],
      quantity: Math.max(1, quantity) // Ensure quantity is at least 1
    };
    
    setFormData({
      ...formData,
      purchases: newPurchases
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.phoneNumber) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Update timestamps for editing
    const updatedData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    // Pass the form data to parent component
    onSave(updatedData);
  };

  // Animation variants
  const dialogVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };
  
  const contentVariants = {
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
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300 } 
    }
  };
  
  const purchaseItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-b sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">
              {isEditing ? "Modifier le client" : "Ajouter un client"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations du client ci-dessous"
              : "Remplissez les informations pour créer un nouveau client"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <ScrollArea className="flex-1 overflow-y-auto" style={{ height: 'calc(90vh - 180px)' }}>
            <div className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Informations du client
                </h3>
                
                {/* Client Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Nom complet*
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-primary/30 transition-all duration-200"
                  />
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Numéro de téléphone*
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-primary/30 transition-all duration-200"
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="focus-visible:ring-primary/30 transition-all duration-200"
                  />
                </div>
                
                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Adresse
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="focus-visible:ring-primary/30 transition-all duration-200"
                  />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Purchases */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Produits achetés
                  </h3>
                  <Button 
                    type="button" 
                    onClick={handleAddPurchase} 
                    size="sm"
                    variant="outline"
                    className="transition-all duration-300 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un produit
                  </Button>
                </div>
                
                {formData.purchases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                    Aucun produit ajouté
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.purchases.map((purchase, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 p-4 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors duration-200"
                      >
                        {/* Product Selection */}
                        <div className="flex-grow">
                          <Label htmlFor={`product-${index}`} className="text-xs mb-1 block">
                            Produit
                          </Label>
                          <Select
                            value={purchase.product.id}
                            onValueChange={(value) => handleProductChange(index, value)}
                          >
                            <SelectTrigger id={`product-${index}`} className="focus-visible:ring-primary/30">
                              <SelectValue placeholder="Sélectionner un produit" />
                            </SelectTrigger>
                            <SelectContent 
                              position="popper"
                              className="bg-popover shadow-xl border border-border/50 backdrop-blur-sm" 
                              align="start"
                              sideOffset={8}
                            >
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - {product.price.toLocaleString()} F CFA
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Quantity */}
                        <div className="w-32">
                          <Label htmlFor={`quantity-${index}`} className="text-xs mb-1 block">
                            Quantité
                          </Label>
                          <div className="flex items-center">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => handleQuantityChange(index, purchase.quantity - 1)}
                              className="h-8 w-8 transition-all duration-200"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              value={purchase.quantity}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                              min="1"
                              className="h-8 text-center mx-1 px-1 w-12"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => handleQuantityChange(index, purchase.quantity + 1)}
                              className="h-8 w-8 transition-all duration-200"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePurchase(index)}
                          className="h-8 w-8 mt-5 text-muted-foreground hover:text-destructive transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-6 border-t bg-muted/20 sticky bottom-0 backdrop-blur-sm mt-auto z-10">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-1" />
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
