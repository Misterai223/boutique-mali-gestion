
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/types/employee";
import ImageSelector from "../shared/ImageSelector";
import { User, Upload } from "lucide-react";

const employeeSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.string().min(1, "Le rôle est requis"),
  photo_url: z.string().optional()
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Employee;
  onSave: (employee: EmployeeFormData) => Promise<boolean>;
}

const employeeRoles = [
  { value: "manager", label: "Gérant/Manager" },
  { value: "sales_representative", label: "Représentant commercial" },
  { value: "cashier", label: "Caissier" },
  { value: "warehouse_worker", label: "Magasinier" },
  { value: "accountant", label: "Comptable" },
  { value: "secretary", label: "Secrétaire" },
  { value: "technician", label: "Technicien" },
  { value: "other", label: "Autre" }
];

const EmployeeForm = ({ open, onOpenChange, initialData, onSave }: EmployeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "sales_representative",
      photo_url: ""
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        full_name: initialData.full_name,
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role,
        photo_url: initialData.photo_url || ""
      });
    } else {
      form.reset({
        full_name: "",
        email: "",
        phone: "",
        role: "sales_representative",
        photo_url: ""
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onSave(data);
      if (success) {
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (url: string) => {
    form.setValue("photo_url", url);
    setIsImageSelectorOpen(false);
  };

  const photoUrl = form.watch("photo_url");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Modifier l'employé" : "Ajouter un employé"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Mettez à jour les informations de l'employé"
                : "Saisissez les informations du nouvel employé"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Photo */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
                  onClick={() => setIsImageSelectorOpen(true)}
                >
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt="Photo employé" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <User className="h-12 w-12 text-secondary-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsImageSelectorOpen(true)}
                >
                  Sélectionner une photo
                </Button>
              </div>

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom et prénom de l'employé" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (facultatif)</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@entreprise.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (facultatif)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+33 6 12 34 56 78" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle dans l'entreprise *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employeeRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : (initialData ? "Mettre à jour" : "Ajouter")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ImageSelector 
        open={isImageSelectorOpen}
        onOpenChange={setIsImageSelectorOpen}
        onSelect={handleImageSelect}
        initialCategory="employees"
      />
    </>
  );
};

export default EmployeeForm;
