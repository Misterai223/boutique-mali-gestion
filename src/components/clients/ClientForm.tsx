
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
import { Client } from "@/types/client";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Save, X, MapPin } from "lucide-react";

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
    full_name: "",
    phone: "",
    address: "",
    email: "",
    country: "Côte d'Ivoire",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (initialData) {
      setFormData({...initialData});
    } else if (open) {
      setFormData({
        id: Date.now().toString(),
        full_name: "",
        phone: "",
        address: "",
        email: "",
        country: "Côte d'Ivoire",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.full_name || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Update timestamps for editing
    const updatedData = {
      ...formData,
      updated_at: new Date().toISOString()
    };
    
    // Pass the form data to parent component
    onSave(updatedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 bg-gradient-to-r from-primary/5 to-transparent border-b">
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
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Informations de base */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Informations du client
                    </h3>
                    
                    {/* Client Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium">
                        Nom complet*
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                    
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Numéro de téléphone*
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
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
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="focus-visible:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                    
                    {/* Address - More prominently displayed */}
                    <div className="space-y-2 border border-dashed p-4 rounded-md bg-muted/10">
                      <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Adresse de résidence*
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="focus-visible:ring-primary/30 transition-all duration-200 min-h-[100px]"
                        placeholder="Entrez l'adresse complète du client..."
                        required
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Pays
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="focus-visible:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Add some bottom padding to ensure last elements are accessible */}
                  <div className="pb-8" />
                </div>
              </div>
              
              <DialogFooter className="flex-shrink-0 p-6 border-t bg-muted/20 sticky bottom-0">
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
