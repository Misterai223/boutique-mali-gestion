
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
  required?: boolean;
}

const EmailInput = ({ email, setEmail, required = true }: EmailInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium">
        Adresse email
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          placeholder="nom@exemple.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={required}
          autoComplete="email"
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default EmailInput;
