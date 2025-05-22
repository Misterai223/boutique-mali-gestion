
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
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
import ProductImageUploader from "./ProductImageUploader";
import { cloudinaryService } from "@/services/cloudinaryService";
import { AnimatePresence } from "framer-motion";
import { Package, Save, X, Image } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Product;
  onSave: (product: Product) => void;
}

const categories = [
  "Téléphones",
  "Accessoires",
  "Tablettes",
  "Ordinateurs",
  "Audio",
  "Caméras",
  "Autres",
];

const ProductForm = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<Product>({
    id: Date.now().toString(),
    name: "",
    category: "",
    price: 0,
    stockQuantity: 0,
    threshold: 5,
    description: "",
    imageUrl: "",
  });

  const [activeTab, setActiveTab] = useState<string>("details");

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (initialData) {
      setFormData({...initialData});
      // Si l'image existe, afficher l'onglet image directement
      if (initialData.imageUrl) {
        setActiveTab("image");
      } else {
        setActiveTab("details");
      }
    } else if (open) {
      setFormData({
        id: Date.now().toString(),
        name: "",
        category: "",
        price: 0,
        stockQuantity: 0,
        threshold: 5,
        description: "",
        imageUrl: "",
      });
      setActiveTab("details");
    }
  }, [initialData, open]);

  const isEditing = !!initialData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Convert number fields from string to number
    if (name === "price" || name === "stockQuantity" || name === "threshold") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleImageChange = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Si Cloudinary est configuré, sauvegarder l'URL de l'image si elle existe
    if (cloudinaryService.isConfigured() && formData.imageUrl) {
      cloudinaryService.saveUploadedFileUrl('products', formData.imageUrl);
    }
    
    // Pass the form data to parent component
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-b sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <DialogTitle className="text-xl">
                  {isEditing ? "Modifier le produit" : "Ajouter un produit"}
                </DialogTitle>
              </div>
              <DialogDescription>
                {isEditing
                  ? "Mettez à jour les informations du produit ci-dessous"
                  : "Remplissez les informations pour créer un nouveau produit"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-4 border-b">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="details" className="flex gap-2 items-center">
                      <Package className="w-4 h-4" />
                      Détails
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex gap-2 items-center">
                      <Image className="w-4 h-4" />
                      Image
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[calc(90vh-240px)]">
                    <TabsContent value="details" className="p-6 space-y-6 mt-0">
                      {/* Informations de base */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Informations de base
                        </h3>
                        
                        {/* Product Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Nom du produit*
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="focus-visible:ring-primary/30"
                          />
                        </div>
                        
                        {/* Category */}
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-medium">
                            Catégorie*
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={handleCategoryChange}
                          >
                            <SelectTrigger id="category" className="focus-visible:ring-primary/30">
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover shadow-md z-50">
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Description */}
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-sm font-medium">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="focus-visible:ring-primary/30 resize-none min-h-[100px]"
                            placeholder="Description détaillée du produit (facultatif)"
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Prix et stock */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Prix et inventaire
                        </h3>
                        
                        {/* Price */}
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-sm font-medium">
                            Prix (XOF)*
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            min={0}
                            required
                            className="focus-visible:ring-primary/30"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Stock Quantity */}
                          <div className="space-y-2">
                            <Label htmlFor="stockQuantity" className="text-sm font-medium">
                              Quantité en stock
                            </Label>
                            <Input
                              id="stockQuantity"
                              name="stockQuantity"
                              type="number"
                              value={formData.stockQuantity}
                              onChange={handleChange}
                              min={0}
                              className="focus-visible:ring-primary/30"
                            />
                          </div>
                          
                          {/* Threshold */}
                          <div className="space-y-2">
                            <Label htmlFor="threshold" className="text-sm font-medium">
                              Seuil d'alerte
                            </Label>
                            <Input
                              id="threshold"
                              name="threshold"
                              type="number"
                              value={formData.threshold}
                              onChange={handleChange}
                              min={1}
                              className="focus-visible:ring-primary/30"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="image" className="p-6 space-y-4 mt-0">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Image du produit
                      </h3>
                      
                      <ProductImageUploader
                        initialImageUrl={formData.imageUrl}
                        onImageChange={handleImageChange}
                      />
                      
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Vous pouvez télécharger une image depuis votre appareil ou sélectionner une image de la bibliothèque média.</p>
                        <p className="mt-2">Format recommandé: JPEG, PNG. Taille maximale: 10MB</p>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </div>
              </Tabs>
              
              <DialogFooter className="p-6 border-t bg-muted/20 sticky bottom-0 backdrop-blur-sm mt-auto">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 shadow-sm"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isEditing ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ProductForm;
