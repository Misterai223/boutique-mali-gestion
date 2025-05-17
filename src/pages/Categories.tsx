
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Search, Filter } from "lucide-react";
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
    description: "Smartphones et téléphones portables",
    slug: "telephones",
    productCount: 24
  },
  {
    id: "2",
    name: "Accessoires",
    description: "Accessoires pour appareils électroniques",
    slug: "accessoires",
    productCount: 36
  },
  {
    id: "3",
    name: "Ordinateurs",
    description: "Ordinateurs portables et fixes",
    slug: "ordinateurs",
    productCount: 12
  },
  {
    id: "4",
    name: "Audio",
    description: "Écouteurs, casques et enceintes",
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

  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
    toast.success(`Catégorie "${category.name}" ajoutée avec succès`);
  };

  const handleEditCategory = (category: Category) => {
    setCategories(categories.map(c => c.id === category.id ? category : c));
    setCategoryToEdit(null);
    toast.success(`Catégorie "${category.name}" mise à jour avec succès`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success("Catégorie supprimée avec succès");
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
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-6 animate-fade-in"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        variants={childVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les catégories de produits de votre boutique
          </p>
        </div>
        <Button 
          onClick={() => {
            setCategoryToEdit(null);
            setIsFormOpen(true);
          }} 
          className="flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 bg-primary"
        >
          <FolderPlus className="mr-2 h-5 w-5" />
          Ajouter une catégorie
        </Button>
      </motion.div>

      <motion.div variants={childVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une catégorie..."
            className="w-full pl-9 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
              <Filter className="h-4 w-4" />
              Trier
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleSort("asc")} className={sortOrder === "asc" ? "bg-accent/20" : ""}>
              Alphabétique (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("desc")} className={sortOrder === "desc" ? "bg-accent/20" : ""}>
              Alphabétique (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("count")} className={sortOrder === "count" ? "bg-accent/20" : ""}>
              Nombre de produits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sortOrder + searchTerm}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <CategoryList 
            categories={filteredCategories} 
            onEdit={openEditForm} 
            onDelete={handleDeleteCategory} 
          />
        </motion.div>
      </AnimatePresence>

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
