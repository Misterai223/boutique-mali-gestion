
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
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { SidebarToggle } from "./topnav/SidebarToggle";

export interface TopNavProps {
  toggleSidebar: () => void;
  collapsed: boolean;
  onLogout: () => void;
}

const TopNav = ({ toggleSidebar, collapsed, onLogout }: TopNavProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
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
      setShowInstallPrompt(true);
    }, 2000);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearTimeout(timer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-14 px-2 sm:px-4">
        {/* Partie gauche */}
        <div className="flex items-center gap-1 sm:gap-3">
          <SidebarToggle toggleSidebar={toggleSidebar} collapsed={collapsed} />
          {!isMobile && <ShopBranding />}
        </div>

        {/* Partie centrale - Recherche */}
        <div className={`${isMobile ? "hidden" : "hidden md:block"} flex-1 mx-4`}>
          <SearchBar />
        </div>

        {/* Partie droite */}
        <div className="flex items-center gap-1 sm:gap-2">
          {!isOnline && (
            <div className="hidden sm:block text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-md">
              Hors ligne
            </div>
          )}
          {showInstallPrompt && !isMobile && <PWAInstallPrompt />}
          
          {/* Sur mobile, afficher seulement les éléments essentiels */}
          {isMobile ? (
            <>
              <SearchBar />
              <UserProfile onLogout={onLogout} />
            </>
          ) : (
            <>
              <NotificationButton />
              <ThemeToggle />
              <UserProfile onLogout={onLogout} />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
