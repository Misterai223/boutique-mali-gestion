
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavItem, navItems } from "./navigation-items";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useEffect, useState } from "react";

interface NavMenuProps {
  isCollapsed: boolean;
}

export function NavMenu({ isCollapsed }: NavMenuProps) {
  const location = useLocation();
  const { filterNavItems, loading } = useRolePermissions();
  const [items, setItems] = useState<NavItem[]>([]);
  
  useEffect(() => {
    // Filtrer les éléments de navigation selon le rôle de l'utilisateur
    const filtered = filterNavItems(navItems);
    setItems(filtered);
  }, [filterNavItems]);

  if (loading) {
    return (
      <div className="flex-1 py-3 px-2">
        <div className="flex items-center justify-center h-36">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 py-3">
      <nav className="grid gap-1 px-2">
        <TooltipProvider delayDuration={0}>
          {items.map((item: NavItem, index: number) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground font-medium"
                      : "transparent"
                  )}
                  onClick={(e) => {
                    // Si on est déjà sur cette page, empêcher la navigation
                    if (location.pathname === item.href) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon className={cn("h-[18px] w-[18px] flex-shrink-0", item.color)} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <Badge 
                      className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center bg-primary text-primary-foreground flex-shrink-0" 
                      variant="secondary"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-accent text-accent-foreground font-medium">
                {item.title}
                {item.badge && <span className="ml-1">({item.badge})</span>}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </ScrollArea>
  );
}
