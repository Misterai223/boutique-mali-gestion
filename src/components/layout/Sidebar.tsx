
import { cn } from "@/lib/utils";
import { ShopLogo } from "./sidebar/ShopLogo";
import { NavMenu } from "./sidebar/NavMenu";
import { useSidebarData } from "@/hooks/useSidebarData";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { shopName, shopLogo } = useSidebarData();
  const isCollapsed = className?.includes("w-20") || className?.includes("w-0") || false;
  const [sidebarColor, setSidebarColor] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Récupérer la couleur de la barre latérale du localStorage
    const updateSidebarColor = () => {
      const savedColor = localStorage.getItem("sidebarColor") || "#1E293B";
      setSidebarColor(savedColor);
    };
    
    updateSidebarColor();
    
    // Écouter les changements de couleur
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sidebarColor") {
        setSidebarColor(e.newValue || "#1E293B");
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('localStorage.updated', updateSidebarColor);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('localStorage.updated', updateSidebarColor);
    };
  }, []);

  // Cacher complètement la sidebar sur mobile quand elle est repliée
  if (isMobile && isCollapsed && className?.includes("w-0")) {
    return null;
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex h-full border-r transition-all duration-300 sidebar-custom overflow-y-auto overflow-x-hidden relative",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-background/80 before:to-background/95 before:backdrop-blur-xl before:z-0",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-primary/5 after:to-transparent after:z-0",
        className
      )}
      style={{ 
        backgroundColor: sidebarColor,
        backgroundImage: `
          linear-gradient(135deg, ${sidebarColor} 0%, ${sidebarColor}dd 50%, ${sidebarColor} 100%),
          radial-gradient(circle at 30% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="py-3 sm:py-4 px-2 sm:px-3 flex flex-col h-full w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <ShopLogo 
            shopName={shopName}
            shopLogo={shopLogo}
            isCollapsed={isCollapsed}
          />
        </motion.div>
        
        <motion.div 
          className="mt-4 flex-grow overflow-y-auto pb-10 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <NavMenu isCollapsed={isCollapsed} />
        </motion.div>

        {/* Decorative gradient at bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"
        />
      </div>
    </motion.aside>
  );
}
