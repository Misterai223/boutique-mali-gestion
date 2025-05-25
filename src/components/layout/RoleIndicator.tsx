
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { Shield, User, CreditCard, Crown } from "lucide-react";
import { motion } from "framer-motion";

const RoleIndicator = () => {
  const { userRole, isAdmin, isCashier, isSalesperson } = usePermissions();

  const getRoleInfo = () => {
    if (isAdmin) {
      return {
        label: "Administrateur",
        variant: "default" as const,
        icon: Crown,
        color: "text-amber-600",
        bgGradient: "from-amber-500/20 to-orange-500/20",
        borderColor: "border-amber-500/30"
      };
    }
    if (isCashier) {
      return {
        label: "Caissier",
        variant: "secondary" as const,
        icon: CreditCard,
        color: "text-emerald-600",
        bgGradient: "from-emerald-500/20 to-green-500/20",
        borderColor: "border-emerald-500/30"
      };
    }
    if (isSalesperson) {
      return {
        label: "Vendeur",
        variant: "outline" as const,
        icon: User,
        color: "text-blue-600",
        bgGradient: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/30"
      };
    }
    return {
      label: "Utilisateur",
      variant: "outline" as const,
      icon: User,
      color: "text-gray-600",
      bgGradient: "from-gray-500/20 to-slate-500/20",
      borderColor: "border-gray-500/30"
    };
  };

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.05 }}
      className="inline-block"
    >
      <Badge 
        variant={roleInfo.variant} 
        className={`
          flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all duration-300
          bg-gradient-to-r ${roleInfo.bgGradient} backdrop-blur-sm
          border ${roleInfo.borderColor} shadow-sm hover:shadow-md
          relative overflow-hidden group cursor-default
        `}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-white/20 to-transparent rounded-full"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <Icon className={`h-3.5 w-3.5 ${roleInfo.color} transition-colors duration-300`} />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/90 font-medium"
        >
          {roleInfo.label}
        </motion.span>
      </Badge>
    </motion.div>
  );
};

export default RoleIndicator;
