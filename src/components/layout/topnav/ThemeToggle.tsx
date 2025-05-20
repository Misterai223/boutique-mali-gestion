
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
  
  // Charger le thème actuel au montage du composant
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setTheme(savedDarkMode ? "dark" : "light");
    
    // Écouter les changements de thème depuis d'autres parties de l'application
    const handleStorageChange = () => {
      const currentDarkMode = localStorage.getItem("darkMode") === "true";
      setTheme(currentDarkMode ? "dark" : "light");
    };
    
    document.addEventListener('localStorage.updated', handleStorageChange);
    
    return () => {
      document.removeEventListener('localStorage.updated', handleStorageChange);
    };
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Mettre à jour localStorage
    localStorage.setItem("darkMode", newTheme === "dark" ? "true" : "false");
    
    // Appliquer le changement de thème
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // Notifier les autres composants
    const event = new Event('localStorage.updated');
    document.dispatchEvent(event);
    
    toast.success(`Mode ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`, {
      duration: 2000,
    });
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
            aria-label="Changer le thème"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Changer le thème</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Changer le thème</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
