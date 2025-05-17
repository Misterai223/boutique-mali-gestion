
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import RoleSelector from "./RoleSelector";
import AccessLevelInput from "./AccessLevelInput";
import { CreateUserForm as CreateUserFormType, createUserSchema } from "./schemas/userFormSchemas";

interface CreateUserFormProps {
  onUserCreated?: () => void;
  onCancel: () => void;
}

const CreateUserForm = ({ onUserCreated, onCancel }: CreateUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateUserFormType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "user",
      access_level: 1
    }
  });

  const handleSubmit = async (data: CreateUserFormType) => {
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
        toast.error(`Erreur: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Utilisateur créé avec succès");
      form.reset(); // Réinitialiser le formulaire après succès
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error: any) {
      console.error("Exception lors de la création de l'utilisateur:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
        
        <RoleSelector form={form} name="role" />
        
        <AccessLevelInput form={form} name="access_level" />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateUserForm;
