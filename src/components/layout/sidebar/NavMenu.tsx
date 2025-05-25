
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { usePermissions } from "@/hooks/usePermissions";

interface NavMenuProps {
  isCollapsed: boolean;
}

export function NavMenu({ isCollapsed }: NavMenuProps) {
  const location = useLocation();
  const { checkPageAccess } = usePermissions();

  // Filtrer les éléments de navigation selon les permissions de l'utilisateur
  const allowedNavItems = navItems.filter(item => checkPageAccess(item.page));

  return (
    <ScrollArea className="flex-1 py-3">
      <nav className="grid gap-1 px-2">
        <TooltipProvider delayDuration={0}>
          {allowedNavItems.map((item: NavItem, index: number) => (
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
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                  {!isCollapsed && item.badge && (
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
  );
}
