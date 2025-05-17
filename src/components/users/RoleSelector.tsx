
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateUserForm, UpdateUserForm } from "./schemas/userFormSchemas";

type FormType = UseFormReturn<CreateUserForm> | UseFormReturn<UpdateUserForm>;

interface RoleSelectorProps {
  form: FormType;
  name: "role";
}

// Définition des rôles disponibles - Simplifiés à deux rôles
const roles = [
  { value: "admin", label: "Administrateur" },
  { value: "employee", label: "Employé" }
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
