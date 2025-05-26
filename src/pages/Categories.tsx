
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Search, Filter, Grid3X3, List, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/category";
import { toast } from "sonner";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";
import { AnimatePresence, motion } from "framer-motion";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Téléphones",
    description: "Smartphones et téléphones portables dernière génération",
    slug: "telephones",
    productCount: 24
  },
  {
    id: "2",
    name: "Accessoires",
    description: "Accessoires pour appareils électroniques et gadgets",
    slug: "accessoires",
    productCount: 36
  },
  {
    id: "3",
    name: "Ordinateurs",
    description: "Ordinateurs portables et fixes haute performance",
    slug: "ordinateurs",
    productCount: 12
  },
  {
    id: "4",
    name: "Audio",
    description: "Écouteurs, casques et enceintes de qualité premium",
    slug: "audio",
    productCount: 18
  }
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "count">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
    toast.success(`Catégorie "${category.name}" ajoutée avec succès`, {
      description: "La nouvelle catégorie est maintenant disponible"
    });
  };

  const handleEditCategory = (category: Category) => {
    setCategories(categories.map(c => c.id === category.id ? category : c));
    setCategoryToEdit(null);
    toast.success(`Catégorie "${category.name}" mise à jour avec succès`, {
      description: "Les modifications ont été sauvegardées"
    });
  };

  const handleDeleteCategory = (id: string) => {
    const deletedCategory = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    toast.success("Catégorie supprimée avec succès", {
      description: `"${deletedCategory?.name}" a été supprimée définitivement`
    });
  };

  const openEditForm = (category: Category) => {
    setCategoryToEdit(category);
    setIsFormOpen(true);
  };

  const sortCategories = useCallback((cats: Category[], order: "asc" | "desc" | "count") => {
    switch (order) {
      case "asc":
        return [...cats].sort((a, b) => a.name.localeCompare(b.name));
      case "desc":
        return [...cats].sort((a, b) => b.name.localeCompare(a.name));
      case "count":
        return [...cats].sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
      default:
        return cats;
    }
  }, []);

  const filteredCategories = sortCategories(
    categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (category.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ),
    sortOrder
  );

  const handleSort = (order: "asc" | "desc" | "count") => {
    setSortOrder(order);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8 p-1"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div 
        variants={childVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5 p-8 border border-primary/10"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          animate={{
            x: ["-100%", "200%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Catégories
              </h1>
              <motion.div
                className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mt-2"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p 
              className="text-muted-foreground text-lg max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Organisez et gérez efficacement toutes les catégories de produits de votre boutique
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => {
                setCategoryToEdit(null);
                setIsFormOpen(true);
              }} 
              className="flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 px-6 py-3 rounded-xl"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Nouvelle catégorie
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div 
        variants={childVariants} 
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une catégorie..."
              className="w-full pl-10 py-3 bg-background/80 border-border/50 focus:border-primary/50 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  ×
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 min-w-[120px] bg-background/80 border-border/50 hover:border-primary/50 transition-all duration-300">
                  <Filter className="h-4 w-4" />
                  Trier
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border/50">
                <DropdownMenuItem 
                  onClick={() => handleSort("asc")} 
                  className={`${sortOrder === "asc" ? "bg-primary/10 text-primary" : ""} transition-colors duration-200`}
                >
                  Alphabétique (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSort("desc")} 
                  className={`${sortOrder === "desc" ? "bg-primary/10 text-primary" : ""} transition-colors duration-200`}
                >
                  Alphabétique (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSort("count")} 
                  className={`${sortOrder === "count" ? "bg-primary/10 text-primary" : ""} transition-colors duration-200`}
                >
                  Nombre de produits
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {filteredCategories.length} catégorie{filteredCategories.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Categories List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sortOrder + searchTerm}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          variants={childVariants}
        >
          <CategoryList 
            categories={filteredCategories} 
            onEdit={openEditForm} 
            onDelete={handleDeleteCategory} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Category Form Modal */}
      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={categoryToEdit}
        onSave={categoryToEdit ? handleEditCategory : handleAddCategory}
      />
    </motion.div>
  );
};

export default Categories;
