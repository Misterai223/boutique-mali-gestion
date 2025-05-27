
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Employee } from "@/types/employee";
import ImageSelector from "../shared/ImageSelector";
import { User, Upload, Save, X, Phone, Mail, Briefcase } from "lucide-react";

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
  const isEditing = !!initialData;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] h-[85vh] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 p-6 bg-gradient-to-r from-primary/5 to-transparent border-b">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl">
                {isEditing ? "Modifier l'employé" : "Ajouter un employé"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {isEditing
                ? "Mettez à jour les informations de l'employé ci-dessous"
                : "Remplissez les informations pour créer un nouvel employé"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
                  <div className="flex-1 p-6">
                    <div className="space-y-6">
                      {/* Photo Section */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Photo de l'employé
                        </h3>
                        
                        <div className="flex flex-col items-center gap-4 p-4 border border-dashed rounded-md bg-muted/10">
                          <div 
                            className="relative cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors duration-200"
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
                            className="transition-all duration-300 hover:shadow-md"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Sélectionner une photo
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Informations personnelles */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Informations personnelles
                        </h3>

                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Nom complet *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Nom et prénom de l'employé"
                                  className="focus-visible:ring-primary/30 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  Email (facultatif)
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="email" 
                                    placeholder="email@entreprise.com"
                                    className="focus-visible:ring-primary/30 transition-all duration-200"
                                  />
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
                                <FormLabel className="text-sm font-medium flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  Téléphone (facultatif)
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="+33 6 12 34 56 78"
                                    className="focus-visible:ring-primary/30 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Rôle professionnel */}
                      <div className="space-y-4 border border-dashed p-4 rounded-md bg-muted/10">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          Rôle dans l'entreprise
                        </h3>

                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Fonction *</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger className="focus-visible:ring-primary/30 transition-all duration-200">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent 
                                  position="popper"
                                  className="bg-popover shadow-xl border border-border/50 backdrop-blur-sm z-50" 
                                  align="start"
                                  sideOffset={8}
                                >
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
                      </div>

                      {/* Add some bottom padding to ensure last elements are accessible */}
                      <div className="pb-8" />
                    </div>
                  </div>

                  <DialogFooter className="flex-shrink-0 p-6 border-t bg-muted/20 sticky bottom-0">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSubmitting ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Ajouter")}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </ScrollArea>
          </div>
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
