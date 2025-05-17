
import { MenuSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./topnav/SearchBar";
import { ShopBranding } from "./topnav/ShopBranding";
import { ThemeToggle } from "./topnav/ThemeToggle";
import { UserProfile } from "./topnav/UserProfile";
import { NotificationButton } from "./topnav/NotificationButton";
import PWAInstallPrompt from "../pwa/PWAInstallPrompt";
import { toast } from "sonner";

export interface TopNavProps {
  toggleSidebar: () => void;
  collapsed: boolean;
  onLogout: () => void;
}

const TopNav = ({ toggleSidebar, collapsed, onLogout }: TopNavProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      
      if (navigator.onLine) {
        toast.success("Connexion rétablie");
      } else {
        toast.error("Connexion perdue", {
          description: "L'application fonctionne en mode hors ligne"
        });
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Afficher le prompt d'installation après un délai
    const timer = setTimeout(() => {
      console.log("Affichage du prompt d'installation PWA");
      setShowInstallPrompt(true);
    }, 2000);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearTimeout(timer);
    };
  }, []);

  console.log("TopNav - showInstallPrompt:", showInstallPrompt);
  
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Partie gauche */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="flex items-center justify-center"
            aria-label={collapsed ? "Ouvrir le menu" : "Fermer le menu"}
          >
            <MenuSquare className="h-5 w-5" />
          </Button>
          <ShopBranding />
        </div>

        {/* Partie centrale - Recherche */}
        <div className="hidden md:block flex-1 mx-4">
          <SearchBar />
        </div>

        {/* Partie droite */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-md">
              Hors ligne
            </div>
          )}
          {showInstallPrompt && <PWAInstallPrompt />}
          <NotificationButton />
          <ThemeToggle />
          <UserProfile onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
