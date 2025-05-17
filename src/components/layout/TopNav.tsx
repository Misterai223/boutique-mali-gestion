
import { SidebarToggle } from "./topnav/SidebarToggle";
import { ShopBranding } from "./topnav/ShopBranding";
import { SearchBar } from "./topnav/SearchBar";
import { ThemeToggle } from "./topnav/ThemeToggle";
import { NotificationButton } from "./topnav/NotificationButton";
import { UserProfile } from "./topnav/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopNavProps { 
  toggleSidebar: () => void;
  collapsed: boolean;
  onLogout: () => void;
}

const TopNav = ({ toggleSidebar, collapsed, onLogout }: TopNavProps) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="h-14 sm:h-16 border-b bg-background/95 backdrop-blur-sm flex items-center px-2 sm:px-4 justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <SidebarToggle toggleSidebar={toggleSidebar} collapsed={collapsed} />
        <ShopBranding />
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {!isMobile && (
          <div className="flex items-center">
            <SearchBar />
          </div>
        )}
        
        <div className="flex items-center">
          {isMobile && <SearchBar />}
          <ThemeToggle />
          <NotificationButton />
          <UserProfile onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
