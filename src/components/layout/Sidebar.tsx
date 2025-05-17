
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Package, Users, BarChart4, Settings, DollarSign, FolderPlus, Boxes, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  requiredRole?: string[];
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Tableau de bord", path: "/" },
  { icon: Package, label: "Produits", path: "/products" },
  { icon: FolderPlus, label: "Catégories", path: "/categories" },
  { icon: Boxes, label: "Gestion de stock", path: "/inventory" },
  { icon: DollarSign, label: "Finances", path: "/finances" },
  { icon: Users, label: "Employés", path: "/employees" },
  { icon: User, label: "Utilisateurs", path: "/users" },
  { icon: BarChart4, label: "Rapports", path: "/reports" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Récupérer le rôle utilisateur du localStorage
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);
  
  const sidebarVariants = {
    expanded: { width: "256px" },
    collapsed: { width: "80px" }
  };
  
  return (
    <motion.aside
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-md",
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border h-16">
        <Link to="/" className="flex items-center justify-center w-full">
          {collapsed ? (
            <motion.span 
              className="text-2xl font-bold bg-sidebar-accent rounded-full h-10 w-10 flex items-center justify-center text-sidebar-accent-foreground"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >SM</motion.span>
          ) : (
            <motion.span 
              className="text-xl font-bold hover:text-sidebar-accent-foreground transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >Shop Manager</motion.span>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li 
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground transition-all duration-200",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" : "",
                      collapsed ? "px-2 justify-center" : "px-4"
                    )}
                  >
                    <motion.div
                      initial={false}
                      animate={{ 
                        marginRight: collapsed ? 0 : "0.5rem",
                        scale: isActive ? 1.1 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                    
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Button>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-2")}>
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">
              {userRole === "admin" ? "A" : 
               userRole === "manager" ? "M" : 
               userRole === "cashier" ? "C" : 
               userRole === "salesperson" ? "V" : "U"}
            </span>
          </div>
          
          {!collapsed && (
            <motion.div 
              className="space-y-1 overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-medium leading-none">
                {userRole === "admin" ? "Administrateur" : 
                 userRole === "manager" ? "Manager" : 
                 userRole === "cashier" ? "Caissier" : 
                 userRole === "salesperson" ? "Vendeur" : "Utilisateur"}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                Connecté
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
