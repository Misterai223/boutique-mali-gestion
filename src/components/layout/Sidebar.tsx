
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Package, Users, BarChart4, Settings, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Tableau de bord", path: "/" },
  { icon: Package, label: "Produits", path: "/products" },
  { icon: DollarSign, label: "Finances", path: "/finances" },
  { icon: Users, label: "Employés", path: "/employees" },
  { icon: BarChart4, label: "Rapports", path: "/reports" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border h-16">
        {collapsed ? (
          <span className="text-2xl font-bold">SM</span>
        ) : (
          <span className="text-xl font-bold">Shop Manager</span>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed ? "px-2" : "px-4"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-2")}>
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium">A</span>
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
