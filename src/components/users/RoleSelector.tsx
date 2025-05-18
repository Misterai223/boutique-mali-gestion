
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateUserForm, UpdateUserForm } from "./schemas/userFormSchemas";

type FormType = UseFormReturn<CreateUserForm> | UseFormReturn<UpdateUserForm>;

interface RoleSelectorProps {
  form: FormType;
  name: "role";
}

// Définition des rôles disponibles avec descriptions détaillées
const roles = [
  { 
    value: "admin", 
    label: "Administrateur", 
    description: "Accès complet à toutes les fonctionnalités de l'application" 
  },
  { 
    value: "employee", 
    label: "Employé", 
    description: "Accès limité aux produits, catégories, employés, finances, médias et clients" 
  }
];

const RoleSelector = ({ form, name }: RoleSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rôle *</FormLabel>
          <Select 
            value={field.value || "employee"} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem 
                  key={role.value} 
                  value={role.value}
                  className="flex flex-col items-start py-2"
                >
                  <div className="font-medium">{role.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{role.description}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoleSelector;
