
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBasket,
  Users,
  UserCog,
  Settings,
  CreditCard,
  BarChart3,
  Tags,
  Building,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";

const navItems = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "Produits",
    icon: Package,
    href: "/products",
    color: "text-violet-500",
  },
  {
    title: "Catégories",
    icon: Tags,
    href: "/categories",
    color: "text-pink-500",
  },
  {
    title: "Commandes",
    icon: ShoppingBasket,
    href: "/orders",
    color: "text-orange-500",
    badge: 5,
  },
  {
    title: "Clients",
    icon: Users,
    href: "/users",
    color: "text-emerald-500",
  },
  {
    title: "Employés",
    icon: UserCog,
    href: "/employees",
    color: "text-blue-500",
  },
  {
    title: "Finances",
    icon: CreditCard,
    href: "/finances",
    color: "text-violet-500",
  },
  {
    title: "Rapport",
    icon: BarChart3,
    href: "/reports",
    color: "text-yellow-500",
  },
  {
    title: "Médias",
    icon: Image,
    href: "/media",
    color: "text-rose-500",
  },
  {
    title: "Paramètres",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [shopName, setShopName] = useState<string>("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Load saved shop name and logo
    const savedShopName = localStorage.getItem("shopName");
    const savedShopLogo = localStorage.getItem("shopLogo");
    
    setShopName(savedShopName || "Shop Manager");
    setShopLogo(savedShopLogo || null);
    
    // Get current user
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    fetchCurrentUser();
    
    // Setup a listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "shopName") {
        setShopName(e.newValue || "Shop Manager");
      } else if (e.key === "shopLogo") {
        setShopLogo(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for local changes (since storage event only fires in different tabs)
    const updateLocalStorage = () => {
      setShopName(localStorage.getItem("shopName") || "Shop Manager");
      setShopLogo(localStorage.getItem("shopLogo") || null);
    };
    
    document.addEventListener('localStorage.updated', updateLocalStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('localStorage.updated', updateLocalStorage);
    };
  }, []);

  return (
    <aside
      className={cn(
        "flex h-full flex-col w-full border-r bg-background transition-all duration-300",
        className
      )}
    >
      <div className="py-4 px-3 flex flex-col h-full">
        <div className="px-3 py-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-1"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-lg border">
              {shopLogo ? (
                <img
                  src={shopLogo}
                  alt="Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  <Building className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                {shopName}
              </span>
              <span className="text-xs text-muted-foreground">Gestion commerciale</span>
            </div>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-3">
          <nav className="grid gap-1 px-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                        location.pathname === item.href
                          ? "bg-accent text-accent-foreground font-medium"
                          : "transparent"
                      )}
                    >
                      <item.icon className={cn("h-[18px] w-[18px]", item.color)} />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center bg-primary text-primary-foreground" 
                          variant="secondary"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-accent text-accent-foreground font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
