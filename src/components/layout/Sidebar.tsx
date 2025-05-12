
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Package, Users, BarChart4, Settings, DollarSign, FolderPlus, Boxes } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Tableau de bord", path: "/" },
  { icon: Package, label: "Produits", path: "/products" },
  { icon: FolderPlus, label: "Catégories", path: "/categories" },
  { icon: Boxes, label: "Gestion de stock", path: "/inventory" },
  { icon: DollarSign, label: "Finances", path: "/finances" },
  { icon: Users, label: "Employés", path: "/employees" },
  { icon: BarChart4, label: "Rapports", path: "/reports" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation();
  
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border shadow-md",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border h-16">
        <Link to="/" className="flex items-center justify-center w-full">
          {collapsed ? (
            <span className="text-2xl font-bold bg-sidebar-accent rounded-full h-10 w-10 flex items-center justify-center text-sidebar-accent-foreground animate-pulse">SM</span>
          ) : (
            <span className="text-xl font-bold hover:text-sidebar-accent-foreground transition-colors">Shop Manager</span>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" : "",
                      collapsed ? "px-2 justify-center" : "px-4"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-2")}>
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">A</span>
          </div>
          {!collapsed && (
            <div className="space-y-1 overflow-hidden">
              <p className="text-sm font-medium leading-none">Admin</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
