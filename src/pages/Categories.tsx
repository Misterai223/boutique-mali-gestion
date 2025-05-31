import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FolderPlus, Search, Folder, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Category } from "@/types/category";
import CategoryForm from "@/components/categories/CategoryForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

// Sample categories data without productCount
const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Téléphones",
    description: "Smartphones et téléphones portables de toutes marques",
    slug: "telephones",
    created_at: "2023-10-01T10:00:00Z",
    updated_at: "2023-10-01T10:00:00Z"
  },
  {
    id: "2", 
    name: "Accessoires",
    description: "Accessoires pour téléphones et électronique",
    slug: "accessoires",
    created_at: "2023-10-02T11:00:00Z",
    updated_at: "2023-10-02T11:00:00Z"
  },
  {
    id: "3",
    name: "Ordinateurs", 
    description: "Ordinateurs portables et de bureau",
    slug: "ordinateurs",
    created_at: "2023-10-03T12:00:00Z",
    updated_at: "2023-10-03T12:00:00Z"
  },
  {
    id: "4",
    name: "Tablettes",
    description: "Tablettes et iPad de différentes marques",
    slug: "tablettes", 
    created_at: "2023-10-04T13:00:00Z",
    updated_at: "2023-10-04T13:00:00Z"
  }
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      // Edit existing category
      setCategories(
        categories.map((c) => (c.id === category.id ? category : c))
      );
      toast.success(`Catégorie "${category.name}" mise à jour avec succès!`);
    } else {
      // Add new category
      setCategories([...categories, category]);
      toast.success(`Catégorie "${category.name}" ajoutée avec succès!`);
    }
    setEditingCategory(null);
    setFormOpen(false);
  };

  const handleDeleteCategory = (category: Category) => {
    // Confirm before delete
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      setCategories(categories.filter((c) => c.id !== category.id));
      toast.success(`Catégorie "${category.name}" supprimée avec succès!`);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const headerVariants = {
    initial: { y: -30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  const searchVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4 } }
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
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 20
      } 
    },
    hover: { 
      y: -10, 
      scale: 1.02, 
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    },
    tap: { 
      scale: 0.98, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        variants={headerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold tracking-tight flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Folder className="h-8 w-8 text-primary" />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Gestion des Catégories
          </motion.span>
        </motion.h1>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            onClick={handleAddCategory} 
            className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
            </motion.div>
            Ajouter une catégorie
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4"
        variants={searchVariants}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une catégorie par nom ou description..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 shadow-sm border-input/60 focus-visible:ring-primary/30"
          />
        </div>
      </motion.div>

      <ScrollArea className="h-[calc(100vh-220px)] w-full pr-4">
        {filteredCategories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                custom={index}
                transition={{ delay: index * 0.1 }}
                className="transform-gpu"
              >
                <Card className="group overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 border-primary/10">
                  <div className="p-4 flex-grow">
                    <h3 className="font-medium text-lg line-clamp-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {categories.length} produits
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditCategory(category)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeleteCategory(category)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-muted/30 rounded-lg border border-dashed"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.3
              }}
            >
              <Folder className="h-16 w-16 mx-auto text-muted-foreground/60" />
            </motion.div>
            <motion.p 
              className="text-muted-foreground mt-4 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Aucune catégorie trouvée
            </motion.p>
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => setSearchTerm("")} 
                  variant="link" 
                  className="mt-2"
                >
                  Réinitialiser la recherche
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </ScrollArea>

      {/* Formulaire d'ajout/modification de catégorie */}
      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingCategory}
        onSave={handleSaveCategory}
      />
    </motion.div>
  );
};

export default Categories;
