
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Tag, Layers } from "lucide-react";
import { Category } from "@/types/category";
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
import { useState } from "react";

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

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <Tag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Aucune catégorie</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          Vous n'avez pas encore créé de catégories. Commencez par ajouter une nouvelle catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((category) => (
        <Card key={category.id} className="hover:shadow-lg transition-shadow card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{category.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm">
                <Tag className="h-3.5 w-3.5 mr-1" />
                {category.slug}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              {category.description || "Aucune description"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex items-center text-muted-foreground">
              <Layers className="h-4 w-4 mr-1" />
              <span className="text-sm">{category.productCount || 0} produits</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => confirmDelete(category.id)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement cette catégorie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryList;
