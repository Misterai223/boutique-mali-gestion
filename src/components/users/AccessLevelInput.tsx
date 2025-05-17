
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateUserForm, UpdateUserForm } from "./schemas/userFormSchemas";

type FormType = UseFormReturn<CreateUserForm> | UseFormReturn<UpdateUserForm>;

interface AccessLevelInputProps {
  form: FormType;
  name: "access_level";
}

const AccessLevelInput = ({ form, name }: AccessLevelInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
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
  );
};

export default AccessLevelInput;
