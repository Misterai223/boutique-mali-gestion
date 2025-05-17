
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, User, LogOut, Sun, Moon, Search, Settings, Building } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserProfile } from "@/services/users/userProfileService";
import { Profile } from "@/types/profile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const TopNav = ({ 
  toggleSidebar, 
  collapsed, 
  onLogout 
}: { 
  toggleSidebar: () => void;
  collapsed: boolean;
  onLogout: () => void;
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [shopName, setShopName] = useState<string>("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load saved shop name and logo
    const savedShopName = localStorage.getItem("shopName");
    const savedShopLogo = localStorage.getItem("shopLogo");
    
    setShopName(savedShopName || "Shop Manager");
    setShopLogo(savedShopLogo || null);
    
    // Check for system preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (isDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    
    // Load user profile
    const fetchUserProfile = async () => {
      setIsProfileLoading(true);
      try {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  
  const getUserInitials = () => {
    if (!userProfile?.full_name) return "U";
    
    return userProfile.full_name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-sm flex items-center px-4 justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-2 hover:bg-muted transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex items-center gap-2">
          {shopLogo ? (
            <img 
              src={shopLogo} 
              alt="Logo" 
              className="h-8 w-auto object-contain"
              onError={() => {
                toast({
                  title: "Erreur de chargement du logo",
                  description: "Impossible de charger l'image du logo",
                  variant: "destructive"
                });
                setShopLogo(null);
              }} 
            />
          ) : (
            <Building className="h-6 w-6 text-primary" />
          )}
          <Link to="/" className="text-lg font-medium hover:text-primary/80 transition-colors hidden sm:block">
            {shopName}
          </Link>
        </div>
        
        <div className="hidden md:flex items-center ml-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full pl-9 py-2 h-9 bg-muted/40 rounded-md focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-muted transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isProfileLoading ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full hover:bg-muted transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-start px-2"
              >
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col items-start">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-20 mt-1" />
                </div>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full hover:bg-muted transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-start p-2"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={userProfile?.avatar_url || undefined} alt="Avatar" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium truncate max-w-[100px]">
                    {userProfile?.full_name || "Utilisateur"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {userProfile?.role || "Connecté"}
                  </span>
                </div>
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;
