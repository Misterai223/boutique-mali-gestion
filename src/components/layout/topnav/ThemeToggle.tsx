
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useEffect(() => {
    // Charger le thème actuel depuis localStorage sans l'appliquer immédiatement
    const savedTheme = localStorage.getItem("darkMode") === "true" ? "dark" : "light";
    setTheme(savedTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Mettre à jour le stockage local
    localStorage.setItem("darkMode", newTheme === "dark" ? "true" : "false");
    
    // Appliquer le thème en mettant à jour uniquement la classe du document sans effet secondaire
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // Déclencher l'événement personnalisé pour informer les autres composants
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
    toast.success(`Mode ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="hover:bg-muted transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Changer le thème</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
