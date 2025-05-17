
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingBasket,
  Tag,
  FileBarChart,
  DollarSign,
  ShoppingCart,
  Package2,
  UserPlus,
  Image
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("pb-12 md:pb-0", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </NavLink>

            <NavLink
              to="/employees"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Employés
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <ShoppingBasket className="mr-2 h-4 w-4" />
              Produits
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Tag className="mr-2 h-4 w-4" />
              Catégories
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Package2 className="mr-2 h-4 w-4" />
              Inventaire
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Commandes
            </NavLink>

            <NavLink
              to="/finances"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Finances
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <FileBarChart className="mr-2 h-4 w-4" />
              Rapports
            </NavLink>
            
            <NavLink
              to="/media-library"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Image className="mr-2 h-4 w-4" />
              Médiathèque
            </NavLink>

            <h2 className="mt-6 px-4 text-lg font-semibold tracking-tight">
              Administration
            </h2>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
