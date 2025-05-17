
import { cn } from "@/lib/utils";
import { ShopLogo } from "./sidebar/ShopLogo";
import { NavMenu } from "./sidebar/NavMenu";
import { useSidebarData } from "@/hooks/useSidebarData";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
    <aside
      className={cn(
        "flex h-full border-r transition-all duration-300 sidebar-custom overflow-y-auto overflow-x-hidden",
        className
      )}
      style={{ backgroundColor: sidebarColor }}
    >
      <div className="py-3 sm:py-4 px-2 sm:px-3 flex flex-col h-full w-full">
        <ShopLogo 
          shopName={shopName}
          shopLogo={shopLogo}
          isCollapsed={isCollapsed}
        />
        <div className="mt-2 flex-grow overflow-y-auto pb-10">
          <NavMenu isCollapsed={isCollapsed} />
        </div>
      </div>
    </aside>
  );
}
