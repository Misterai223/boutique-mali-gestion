
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Tag, Layers } from "lucide-react";
import { Category } from "@/types/category";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      onDelete(categoryToDelete);
      setCategoryToDelete(null);
    }
    setIsDialogOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (categories.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-muted rounded-full p-6 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Tag className="h-10 w-10 text-muted-foreground" />
        </motion.div>
        <h3 className="text-xl font-semibold">Aucune catégorie</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          Vous n'avez pas encore créé de catégories. Commencez par ajouter une nouvelle catégorie.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={cardVariants} whileHover={{ y: -5 }}>
          <Card className="h-full hover:shadow-lg transition-shadow bg-card group overflow-hidden border-primary/10">
            <CardHeader className="pb-3 bg-gradient-to-br from-transparent to-background/5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{category.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center text-sm mt-1">
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      {category.slug}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(category)}
                    className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => confirmDelete(category.id)}
                    className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description || "Aucune description"}
              </p>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <div className="flex items-center text-muted-foreground w-full justify-between">
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{category.productCount || 0} produits</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto text-xs px-2 h-7 rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement cette catégorie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default CategoryList;
