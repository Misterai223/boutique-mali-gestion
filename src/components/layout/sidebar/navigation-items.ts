
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  UserCog, 
  Settings, 
  CreditCard, 
  BarChart3, 
  Tags, 
  Image 
} from "lucide-react";

export interface NavItem {
  title: string;
  icon: any;
  href: string;
  color: string;
  badge?: number;
  page: string; // Identifiant de la page pour les permissions
}

export const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
    page: "dashboard",
  },
  {
    title: "Produits",
    icon: Package,
    href: "/products",
    color: "text-violet-500",
    page: "products",
  },
  {
    title: "Catégories",
    icon: Tags,
    href: "/categories",
    color: "text-pink-500",
    page: "categories",
  },
  {
    title: "Clients",
    icon: Users,
    href: "/clients",
    color: "text-emerald-500",
    page: "clients",
  },
  {
    title: "Utilisateurs",
    icon: UserCog,
    href: "/user-management",
    color: "text-blue-500",
    page: "user-management",
  },
  {
    title: "Employés",
    icon: UserCog,
    href: "/employees",
    color: "text-indigo-500",
    page: "employees",
  },
  {
    title: "Finances",
    icon: CreditCard,
    href: "/finances",
    color: "text-violet-500",
    page: "finances",
  },
  {
    title: "Rapport",
    icon: BarChart3,
    href: "/reports",
    color: "text-yellow-500",
    page: "reports",
  },
  {
    title: "Médias",
    icon: Image,
    href: "/media",
    color: "text-rose-500",
    page: "media",
  },
  {
    title: "Paramètres",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
    page: "settings",
  },
];
