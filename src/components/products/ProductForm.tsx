
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
import { motion, AnimatePresence } from "framer-motion";
import { Package, Save, X, Image, DollarSign, Archive, Tag, FileText, Sparkles, TrendingUp } from "lucide-react";
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
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[95vh] flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full flex flex-col"
            >
              <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-b sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(var(--primary-rgb), 0.3)",
                        "0 0 30px rgba(var(--primary-rgb), 0.5)",
                        "0 0 20px rgba(var(--primary-rgb), 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30"
                  >
                    <Package className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {isEditing ? "Modifier le produit" : "Nouveau produit"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {isEditing
                        ? "Mettez à jour les informations de votre produit"
                        : "Ajoutez un nouveau produit à votre inventaire"}
                    </DialogDescription>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5 text-accent" />
                  </motion.div>
                </div>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1">
                  <div className="px-6 pt-4 border-b bg-gradient-to-r from-muted/30 to-transparent">
                    <TabsList className="w-full grid grid-cols-2 bg-background/50 backdrop-blur-sm border shadow-sm">
                      <TabsTrigger value="details" className="flex gap-2 items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">Détails</span>
                      </TabsTrigger>
                      <TabsTrigger value="image" className="flex gap-2 items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
                        <Image className="w-4 h-4" />
                        <span className="hidden sm:inline">Image</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[calc(95vh-280px)]">
                      <TabsContent value="details" className="p-6 space-y-8 mt-0">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-6"
                        >
                          {/* Informations de base */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground">
                                Informations de base
                              </h3>
                            </div>
                            
                            <div className="grid gap-4">
                              {/* Product Name */}
                              <motion.div 
                                className="space-y-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  Nom du produit*
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                  className="focus-visible:ring-primary/30 border-primary/20 bg-background/50 backdrop-blur-sm"
                                  placeholder="Entrez le nom du produit"
                                />
                              </motion.div>
                              
                              {/* Category */}
                              <motion.div 
                                className="space-y-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-primary" />
                                  Catégorie*
                                </Label>
                                <Select
                                  value={formData.category}
                                  onValueChange={handleCategoryChange}
                                >
                                  <SelectTrigger id="category" className="focus-visible:ring-primary/30 border-primary/20 bg-background/50 backdrop-blur-sm">
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover/95 backdrop-blur-sm shadow-xl border-primary/20 z-50">
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category} className="hover:bg-primary/10">
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </motion.div>
                              
                              {/* Description */}
                              <motion.div 
                                className="space-y-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  Description
                                </Label>
                                <Textarea
                                  id="description"
                                  name="description"
                                  value={formData.description || ''}
                                  onChange={handleChange}
                                  className="focus-visible:ring-primary/30 resize-none min-h-[120px] border-primary/20 bg-background/50 backdrop-blur-sm"
                                  placeholder="Description détaillée du produit (facultatif)"
                                />
                              </motion.div>
                            </div>
                          </div>
                          
                          <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                          
                          {/* Prix et stock */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground">
                                Prix et inventaire
                              </h3>
                            </div>
                            
                            {/* Price */}
                            <motion.div 
                              className="space-y-2"
                              whileHover={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
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
                                className="focus-visible:ring-primary/30 border-primary/20 bg-background/50 backdrop-blur-sm"
                                placeholder="0"
                              />
                            </motion.div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Stock Quantity */}
                              <motion.div 
                                className="space-y-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Label htmlFor="stockQuantity" className="text-sm font-medium flex items-center gap-2">
                                  <Archive className="h-4 w-4 text-blue-600" />
                                  Quantité en stock
                                </Label>
                                <Input
                                  id="stockQuantity"
                                  name="stockQuantity"
                                  type="number"
                                  value={formData.stockQuantity}
                                  onChange={handleChange}
                                  min={0}
                                  className="focus-visible:ring-primary/30 border-primary/20 bg-background/50 backdrop-blur-sm"
                                  placeholder="0"
                                />
                              </motion.div>
                              
                              {/* Threshold */}
                              <motion.div 
                                className="space-y-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Label htmlFor="threshold" className="text-sm font-medium flex items-center gap-2">
                                  <Archive className="h-4 w-4 text-orange-600" />
                                  Seuil d'alerte
                                </Label>
                                <Input
                                  id="threshold"
                                  name="threshold"
                                  type="number"
                                  value={formData.threshold}
                                  onChange={handleChange}
                                  min={1}
                                  className="focus-visible:ring-primary/30 border-primary/20 bg-background/50 backdrop-blur-sm"
                                  placeholder="5"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="image" className="p-6 space-y-4 mt-0">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                              Image du produit
                            </h3>
                          </div>
                          
                          <ProductImageUploader
                            initialImageUrl={formData.imageUrl}
                            onImageChange={handleImageChange}
                          />
                          
                          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed border-primary/20">
                            <div className="text-sm text-muted-foreground space-y-2">
                              <p className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-accent" />
                                Ajoutez une image pour rendre votre produit plus attractif
                              </p>
                              <p>• Format recommandé: JPEG, PNG</p>
                              <p>• Taille maximale: 10MB</p>
                              <p>• Résolution optimale: 800x800px</p>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>
                    </ScrollArea>
                  </div>
                </Tabs>
                
                <DialogFooter className="p-6 border-t bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 backdrop-blur-sm sticky bottom-0 mt-auto">
                  <motion.div 
                    className="flex gap-3 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                      className="flex-1 border-primary/20 hover:bg-primary/5"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-primary via-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ProductForm;
