
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { Shield, User, CreditCard } from "lucide-react";

const RoleIndicator = () => {
  const { userRole, isAdmin, isCashier, isSalesperson } = usePermissions();

  const getRoleInfo = () => {
    if (isAdmin) {
      return {
        label: "Administrateur",
        variant: "default" as const,
        icon: Shield,
        color: "text-blue-600"
      };
    }
    if (isCashier) {
      return {
        label: "Caissier",
        variant: "secondary" as const,
        icon: CreditCard,
        color: "text-green-600"
      };
    }
    if (isSalesperson) {
      return {
        label: "Vendeur",
        variant: "outline" as const,
        icon: User,
        color: "text-orange-600"
      };
    }
    return {
      label: "Utilisateur",
      variant: "outline" as const,
      icon: User,
      color: "text-gray-600"
    };
  };

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  return (
    <Badge variant={roleInfo.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${roleInfo.color}`} />
      <span>{roleInfo.label}</span>
    </Badge>
  );
};

export default RoleIndicator;
