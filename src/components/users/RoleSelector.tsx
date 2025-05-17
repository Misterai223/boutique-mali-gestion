
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateUserForm, UpdateUserForm } from "./schemas/userFormSchemas";

type FormType = UseFormReturn<CreateUserForm> | UseFormReturn<UpdateUserForm>;

interface RoleSelectorProps {
  form: FormType;
  name: "role";
}

// Définition des rôles disponibles
const roles = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Caissier" },
  { value: "salesperson", label: "Vendeur" },
  { value: "user", label: "Utilisateur" }
];

const RoleSelector = ({ form, name }: RoleSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rôle</FormLabel>
          <Select 
            value={field.value || "user"} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roles.map((role) => (
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
  );
};

export default RoleSelector;
