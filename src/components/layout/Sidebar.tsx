
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
  const [currentPrimaryColor, setCurrentPrimaryColor] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Récupérer la couleur principale du localStorage
    const updatePrimaryColor = () => {
      const savedColor = localStorage.getItem("primaryColor") || "#3B82F6";
      setCurrentPrimaryColor(savedColor);
      console.log("Sidebar: Couleur principale mise à jour:", savedColor);
    };
    
    updatePrimaryColor();
    
    // Écouter les changements de couleur via localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "primaryColor") {
        const newColor = e.newValue || "#3B82F6";
        setCurrentPrimaryColor(newColor);
        console.log("Sidebar: Nouvelle couleur via storage:", newColor);
      }
    };
    
    // Écouter l'événement personnalisé de mise à jour de la sidebar
    const handleSidebarUpdate = (e: CustomEvent) => {
      const newColor = e.detail.color;
      setCurrentPrimaryColor(newColor);
      console.log("Sidebar: Nouvelle couleur via événement:", newColor);
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('localStorage.updated', updatePrimaryColor);
    document.addEventListener('sidebar-color-update', handleSidebarUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('localStorage.updated', updatePrimaryColor);
      document.removeEventListener('sidebar-color-update', handleSidebarUpdate as EventListener);
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
        className
      )}
      style={{ 
        backgroundColor: currentPrimaryColor,
        backgroundImage: `
          linear-gradient(135deg, ${currentPrimaryColor} 0%, ${currentPrimaryColor}ee 50%, ${currentPrimaryColor} 100%),
          radial-gradient(circle at 30% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)
        `,
        color: '#ffffff'
      }}
    >
      {/* Pattern de fond subtil sans masquer la couleur */}
      <div className="absolute inset-0 opacity-10 z-0">
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

      <div className={`${isMobile ? 'py-2 px-2' : 'py-3 sm:py-4 px-2 sm:px-3'} flex flex-col h-full w-full relative z-10`}>
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
          className={`${isMobile ? 'mt-3' : 'mt-4'} flex-grow overflow-y-auto ${isMobile ? 'pb-6' : 'pb-10'} space-y-1 sm:space-y-2`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <NavMenu isCollapsed={isCollapsed} />
        </motion.div>

        {/* Dégradé décoratif en bas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none ${
            isMobile ? 'h-16' : 'h-20'
          }`}
        />
      </div>
    </motion.aside>
  );
}
