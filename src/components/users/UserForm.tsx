
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { userService } from "@/services/userService";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Profile | null;
  onUserCreated?: () => void;
  onUserUpdated?: () => void;
}

// Schéma de validation pour la création d'utilisateur
const createUserSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  full_name: z.string().min(2, "Le nom complet est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  access_level: z.coerce.number().min(1).max(5)
});

// Schéma de validation pour la modification d'utilisateur
const updateUserSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  access_level: z.coerce.number().min(1).max(5)
});

type CreateUserForm = z.infer<typeof createUserSchema>;
type UpdateUserForm = z.infer<typeof updateUserSchema>;

const UserForm = ({ open, onOpenChange, initialData, onUserCreated, onUserUpdated }: UserFormProps) => {
  const isEditMode = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formulaire pour la création d'utilisateur
  const createForm = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "user",
      access_level: 1
    }
  });
  
  // Formulaire pour la modification d'utilisateur
  const updateForm = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      full_name: "",
      role: "user",
      access_level: 1
    }
  });
  
  // Mettre à jour les valeurs par défaut lors de l'ouverture en mode édition
  useEffect(() => {
    if (isEditMode && initialData) {
      updateForm.reset({
        full_name: initialData.full_name || "",
        role: initialData.role,
        access_level: initialData.access_level
      });
    } else {
      createForm.reset({
        email: "",
        password: "",
        full_name: "",
        role: "user",
        access_level: 1
      });
    }
  }, [initialData, isEditMode, open]);
  
  const handleCreateSubmit = async (data: CreateUserForm) => {
    setIsSubmitting(true);
    try {
      console.log("Données du formulaire de création:", data);
      
      const { error } = await userService.createUser(data.email, data.password, {
        full_name: data.full_name,
        role: data.role,
        access_level: data.access_level
      });
      
      if (error) {
        console.error("Erreur lors de la création:", error);
        toast.error(`Erreur lors de la création: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Utilisateur créé avec succès");
      onUserCreated?.();
    } catch (error: any) {
      console.error("Exception lors de la création de l'utilisateur:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateSubmit = async (data: UpdateUserForm) => {
    if (!initialData) return;
    
    setIsSubmitting(true);
    try {
      const result = await userService.updateProfile({
        id: initialData.id,
        full_name: data.full_name,
        role: data.role,
        access_level: data.access_level
      });
      
      if (result) {
        onUserUpdated?.();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>
        
        {isEditMode ? (
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="cashier">Caissier</SelectItem>
                        <SelectItem value="salesperson">Vendeur</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="access_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d'accès (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="cashier">Caissier</SelectItem>
                        <SelectItem value="salesperson">Vendeur</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="access_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d'accès (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
