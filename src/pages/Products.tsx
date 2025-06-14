import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import ProductForm from "@/components/products/ProductForm";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import { ProductWithCategory } from "@/types/product";
import { Plus, Search, Filter, PackageOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Sample data
const initialProducts: ProductWithCategory[] = [
  {
    id: "1",
    name: "iPhone 13",
    category_id: "cat1",
    price: 350000,
    stock_quantity: 15,
    threshold: 5,
    description: "Un smartphone haut de gamme avec d'excellentes performances",
    image_url: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat1", name: "Téléphones", slug: "telephones" }
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    category_id: "cat1",
    price: 280000,
    stock_quantity: 3,
    threshold: 5,
    description: "Un smartphone puissant avec un excellent appareil photo",
    image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat1", name: "Téléphones", slug: "telephones" }
  },
  {
    id: "3",
    name: "Écouteurs Bluetooth",
    category_id: "cat2",
    price: 25000,
    stock_quantity: 5,
    threshold: 10,
    description: "Écouteurs sans fil avec réduction de bruit",
    image_url: "https://images.unsplash.com/photo-1606400082777-ef05f3c5e084?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat2", name: "Accessoires", slug: "accessoires" }
  },
  {
    id: "4",
    name: "Câble USB-C",
    category_id: "cat2",
    price: 5000,
    stock_quantity: 4,
    threshold: 20,
    description: "Câble de charge pour appareils USB-C",
    image_url: "https://images.unsplash.com/photo-1621370115429-cf6c8f4e0f54?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat2", name: "Accessoires", slug: "accessoires" }
  },
  {
    id: "5",
    name: "iPad Pro",
    category_id: "cat3",
    price: 450000,
    stock_quantity: 0,
    threshold: 3,
    description: "Tablette professionnelle avec écran Liquid Retina",
    image_url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat3", name: "Tablettes", slug: "tablettes" }
  },
  {
    id: "6",
    name: "MacBook Air",
    category_id: "cat4",
    price: 650000,
    stock_quantity: 8,
    threshold: 2,
    description: "Ordinateur portable léger et puissant",
    image_url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
    sku: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat4", name: "Ordinateurs", slug: "ordinateurs" }
  },
];

const Products = () => {
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductWithCategory | undefined>(undefined);
  const [viewProduct, setViewProduct] = useState<ProductWithCategory | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Extraire les catégories uniques des produits
  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)))];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === "Tous" || product.category?.name === activeCategory;
      
      return matchesSearch && matchesCategory;
    }
  );

  const handleAddEditProduct = (product: ProductWithCategory) => {
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

  const handleEditClick = (product: ProductWithCategory) => {
    setCurrentProduct({...product}); // Make a copy to avoid direct mutation
    setDialogOpen(true);
  };

  const handleViewClick = (product: ProductWithCategory) => {
    setViewProduct(product);
    setDetailModalOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentProduct(undefined);
    setDialogOpen(false);
  };

  const handleCloseDetailModal = () => {
    setViewProduct(null);
    setDetailModalOpen(false);
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(var(--primary-rgb), 0.2)",
                  "0 0 40px rgba(var(--primary-rgb), 0.4)", 
                  "0 0 20px rgba(var(--primary-rgb), 0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20"
            >
              <PackageOpen className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="h-4 w-4 text-accent" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Produits
            </h1>
            <p className="text-muted-foreground text-sm">
              Gérez votre inventaire de produits
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)} 
          className="bg-gradient-to-r from-primary via-primary to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="h-4 w-4 mr-2" />
          </motion.div>
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
                onView={handleViewClick}
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

      <ProductDetailModal
        product={viewProduct}
        open={detailModalOpen}
        onOpenChange={handleCloseDetailModal}
        onEdit={handleEditClick}
      />
    </motion.div>
  );
};

export default Products;
