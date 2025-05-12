
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, FolderPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/category";
import { toast } from "sonner";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (category.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout onLogout={() => {}}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les catégories de produits de votre boutique
            </p>
          </div>
          <Button onClick={() => {
            setCategoryToEdit(null);
            setIsFormOpen(true);
          }} className="flex-shrink-0 shadow-md">
            <FolderPlus className="mr-2 h-5 w-5" />
            Ajouter une catégorie
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une catégorie..."
            className="w-full pl-9 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CategoryList 
          categories={filteredCategories} 
          onEdit={openEditForm} 
          onDelete={handleDeleteCategory} 
        />

        <CategoryForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          initialData={categoryToEdit}
          onSave={categoryToEdit ? handleEditCategory : handleAddCategory}
        />
      </div>
    </DashboardLayout>
  );
};

export default Categories;
