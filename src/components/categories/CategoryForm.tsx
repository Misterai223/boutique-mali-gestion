
import { useState } from "react";
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
import { Category } from "@/types/category";
import { toast } from "sonner";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Category | null;
  onSave: (category: Category) => void;
}

const CategoryForm = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}: CategoryFormProps) => {
  const [formData, setFormData] = useState<Category>(
    initialData || {
      id: Date.now().toString(),
      name: "",
      slug: "",
      description: "",
    }
  );

  const isEditing = !!initialData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name if it's a new category or if we're editing the name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      setFormData({
        ...formData,
        [name]: value,
        slug: slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.slug) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    onSave(formData);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        id: Date.now().toString(),
        name: "",
        slug: "",
        description: "",
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Mettez à jour les informations de la catégorie ci-dessous"
                : "Remplissez les informations pour créer une nouvelle catégorie"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Category Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
                autoFocus
              />
            </div>
            
            {/* Slug */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug*
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="shadow-md">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
