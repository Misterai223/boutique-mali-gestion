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
import { Category } from "@/types/category";
import { toast } from "sonner";
import { Check, FolderSync, Tag, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(
        initialData || {
          id: Date.now().toString(),
          name: "",
          slug: "",
          description: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
    }
  }, [open, initialData]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.slug) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 600));
      
      const updatedFormData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      
      onSave(updatedFormData);
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          id: Date.now().toString(),
          name: "",
          slug: "",
          description: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl flex items-center gap-2">
              {isEditing ? (
                <>
                  <FolderSync className="h-5 w-5 text-primary" />
                  Modifier la catégorie
                </>
              ) : (
                <>
                  <Tag className="h-5 w-5 text-primary" />
                  Ajouter une catégorie
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Mettez à jour les informations de la catégorie ci-dessous"
                : "Remplissez les informations pour créer une nouvelle catégorie"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(100vh-250px)] px-6">
            <form id="category-form" onSubmit={handleSubmit}>
              <div className="space-y-6 py-4">
                {/* Category Name */}
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom de la catégorie <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-8"
                      required
                      autoFocus
                      placeholder="Ex: Smartphones, Accessoires..."
                    />
                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
                
                {/* Slug */}
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Slug <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground font-normal ml-2">
                      (Identifiant URL)
                    </span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full"
                    required
                    placeholder="ex: smartphones"
                  />
                </motion.div>
                
                {/* Description */}
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      className="w-full min-h-[80px] pl-8 pt-2 resize-none"
                      placeholder="Description de la catégorie..."
                    />
                    <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              </div>
            </form>
          </ScrollArea>
          
          <DialogFooter className="bg-muted/30 px-6 py-4 border-t">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                form="category-form"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
