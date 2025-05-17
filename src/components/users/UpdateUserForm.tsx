
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { Profile } from "@/types/profile";
import RoleSelector from "./RoleSelector";
import AccessLevelInput from "./AccessLevelInput";
import { UpdateUserForm as UpdateUserFormType, updateUserSchema } from "./schemas/userFormSchemas";

interface UpdateUserFormProps {
  initialData: Profile;
  onUserUpdated?: () => void;
  onCancel: () => void;
}

const UpdateUserForm = ({ initialData, onUserUpdated, onCancel }: UpdateUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UpdateUserFormType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      full_name: "",
      role: "user",
      access_level: 1
    }
  });
  
  // Mettre à jour les valeurs par défaut quand initialData change
  useEffect(() => {
    if (initialData) {
      form.reset({
        full_name: initialData.full_name || "",
        role: initialData.role,
        access_level: initialData.access_level
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: UpdateUserFormType) => {
    setIsSubmitting(true);
    try {
      const result = await userService.updateProfile({
        id: initialData.id,
        full_name: data.full_name,
        role: data.role,
        access_level: data.access_level
      });
      
      if (result) {
        toast.success("Utilisateur mis à jour avec succès");
        onUserUpdated?.();
      } else {
        toast.error("Erreur lors de la mise à jour de l'utilisateur");
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
