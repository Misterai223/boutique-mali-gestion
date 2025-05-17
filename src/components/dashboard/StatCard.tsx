
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  style?: React.CSSProperties;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  style,
}: StatCardProps) => {
  return (
    <Card className={cn("stat-card group", className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.2 }}
          className="rounded-full bg-primary/10 p-2 text-primary"
        >
          <Icon className="h-4 w-4" />
        </motion.div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold group-hover:text-primary transition-colors duration-200"
        >
          {value}
        </motion.div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <motion.span
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                  "flex items-center gap-0.5 bg-muted/50 rounded-full px-2 py-0.5"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </motion.span>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
