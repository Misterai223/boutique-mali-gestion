
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  toggleSidebar: () => void;
  collapsed: boolean;
}

export function SidebarToggle({ toggleSidebar, collapsed }: SidebarToggleProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className="mr-2 hover:bg-muted transition-all duration-200"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
