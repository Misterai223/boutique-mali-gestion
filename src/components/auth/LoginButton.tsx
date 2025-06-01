
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoginButtonProps {
  isLoading: boolean;
}

const LoginButton = ({ isLoading }: LoginButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      type="submit" 
      className={`w-full group transition-all duration-300 ${
        isMobile ? 'h-11 text-base' : 'h-10'
      } bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl`}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className={`animate-spin ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={isMobile ? 'text-base' : 'text-sm'}>Connexion en cours...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <LogIn className={`transition-transform group-hover:translate-x-1 ${
            isMobile ? 'h-5 w-5' : 'h-4 w-4'
          }`} />
          <span className={isMobile ? 'text-base font-medium' : 'text-sm'}>Se connecter</span>
        </span>
      )}
    </Button>
  );
};

export default LoginButton;
