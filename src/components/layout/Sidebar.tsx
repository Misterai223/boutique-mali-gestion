
import { cn } from "@/lib/utils";
import { ShopLogo } from "./sidebar/ShopLogo";
import { NavMenu } from "./sidebar/NavMenu";
import { useSidebarData } from "@/hooks/useSidebarData";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { shopName, shopLogo } = useSidebarData();
  const isCollapsed = className?.includes("w-20") || false;

  return (
    <aside
      className={cn(
        "flex h-full w-full border-r bg-background transition-all duration-300",
        className
      )}
    >
      <div className="py-4 px-3 flex flex-col h-full w-full">
        <ShopLogo 
          shopName={shopName}
          shopLogo={shopLogo}
          isCollapsed={isCollapsed}
        />
        <NavMenu isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
