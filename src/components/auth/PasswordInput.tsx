
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PasswordInputProps {
  password: string;
  setPassword: (value: string) => void;
  required?: boolean;
  onForgotPassword?: (e: React.MouseEvent) => void;
}

const PasswordInput = ({ 
  password, 
  setPassword, 
  required = true,
  onForgotPassword 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="password" className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>
          Mot de passe
        </Label>
        <a 
          href="#" 
          className={`${isMobile ? 'text-xs' : 'text-xs'} text-primary hover:underline transition-colors`}
          onClick={onForgotPassword}
        >
          Mot de passe oublié?
        </a>
      </div>
      <div className="relative">
        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
          isMobile ? 'h-4 w-4' : 'h-4 w-4'
        }`} />
        <Input
          id="password"
          placeholder="Votre mot de passe"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={required}
          autoComplete="current-password"
          className={`pl-10 pr-10 ${isMobile ? 'h-10 text-base' : 'h-10'} transition-all duration-200 focus:ring-2 focus:ring-primary/20`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${
            isMobile ? 'p-1' : ''
          }`}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className={isMobile ? 'h-4 w-4' : 'h-4 w-4'} />
          ) : (
            <Eye className={isMobile ? 'h-4 w-4' : 'h-4 w-4'} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
