
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
  Image,
  User
} from "lucide-react";

export interface NavItem {
  title: string;
  icon: any; // Using any for Lucide icon components
  href: string;
  color: string;
  badge?: number;
}

export const navItems: NavItem[] = [
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
    title: "Clients",
    icon: User,
    href: "/clients",
    color: "text-green-500",
  },
  {
    title: "Utilisateurs",
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
