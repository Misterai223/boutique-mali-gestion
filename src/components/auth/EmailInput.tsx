
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
  required?: boolean;
}

const EmailInput = ({ email, setEmail, required = true }: EmailInputProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>
        Adresse email
      </Label>
      <div className="relative">
        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
          isMobile ? 'h-4 w-4' : 'h-4 w-4'
        }`} />
        <Input
          id="email"
          placeholder="nom@exemple.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={required}
          autoComplete="email"
          className={`pl-10 ${isMobile ? 'h-10 text-base' : 'h-10'} transition-all duration-200 focus:ring-2 focus:ring-primary/20`}
        />
      </div>
    </div>
  );
};

export default EmailInput;
