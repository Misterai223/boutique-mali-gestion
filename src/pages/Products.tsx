
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import ProductForm from "@/components/products/ProductForm";
import { Product } from "@/types/product";
import { Plus, Search, Filter, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Sample data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 13",
    category: "Téléphones",
    price: 350000,
    stockQuantity: 15,
    threshold: 5,
    description: "Un smartphone haut de gamme avec d'excellentes performances",
    imageUrl: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    category: "Téléphones",
    price: 280000,
    stockQuantity: 3,
    threshold: 5,
    description: "Un smartphone puissant avec un excellent appareil photo",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Écouteurs Bluetooth",
    category: "Accessoires",
    price: 25000,
    stockQuantity: 5,
    threshold: 10,
    description: "Écouteurs sans fil avec réduction de bruit",
    imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5e084?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Câble USB-C",
    category: "Accessoires",
    price: 5000,
    stockQuantity: 4,
    threshold: 20,
    description: "Câble de charge pour appareils USB-C",
    imageUrl: "https://images.unsplash.com/photo-1621370115429-cf6c8f4e0f54?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "iPad Pro",
    category: "Tablettes",
    price: 450000,
    stockQuantity: 0,
    threshold: 3,
    description: "Tablette professionnelle avec écran Liquid Retina",
    imageUrl: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "MacBook Air",
    category: "Ordinateurs",
    price: 650000,
    stockQuantity: 8,
    threshold: 2,
    description: "Ordinateur portable léger et puissant",
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
  },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Extraire les catégories uniques des produits
  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    }
  );

  const handleAddEditProduct = (product: Product) => {
    if (currentProduct) {
      // Edit existing product
      setProducts(
        products.map((p) => (p.id === product.id ? product : p))
      );
      toast.success(`Produit "${product.name}" mis à jour avec succès!`);
    } else {
      // Add new product with a new ID
      const newProduct = {
        ...product,
        id: Date.now().toString(), // Ensure unique ID
      };
      setProducts([...products, newProduct]);
      toast.success(`Produit "${product.name}" ajouté avec succès!`);
    }
    setCurrentProduct(undefined);
    setDialogOpen(false);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct({...product}); // Make a copy to avoid direct mutation
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentProduct(undefined);
    setDialogOpen(false);
  };

  const containerVariants = {
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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PackageOpen className="h-8 w-8 text-primary" />
          Produits
        </h1>
        <Button 
          onClick={() => setDialogOpen(true)} 
          className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4"
        variants={itemVariants}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit par nom ou catégorie..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 shadow-sm border-input/60 focus-visible:ring-primary/30"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`shrink-0 ${isFilterVisible ? 'bg-primary/10' : ''}`}
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isFilterVisible && (
          <motion.div 
            className="bg-card/50 backdrop-blur-sm p-4 rounded-lg border shadow-sm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium mb-3">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge 
                  key={category}
                  variant={category === activeCategory ? "default" : "outline"}
                  className="cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProducts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ProductCard
                product={product}
                onEdit={handleEditClick}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16 bg-muted/30 rounded-lg border border-dashed"
          variants={itemVariants}
        >
          <PackageOpen className="h-16 w-16 mx-auto text-muted-foreground/60" />
          <p className="text-muted-foreground mt-4 text-lg">Aucun produit trouvé</p>
          <Button 
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("Tous");
            }} 
            variant="link" 
            className="mt-2"
          >
            Réinitialiser les filtres
          </Button>
        </motion.div>
      )}

      <ProductForm
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        initialData={currentProduct}
        onSave={handleAddEditProduct}
      />
    </motion.div>
  );
};

export default Products;
