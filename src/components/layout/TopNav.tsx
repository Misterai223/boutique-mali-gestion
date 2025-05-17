
import { SidebarToggle } from "./topnav/SidebarToggle";
import { ShopBranding } from "./topnav/ShopBranding";
import { SearchBar } from "./topnav/SearchBar";
import { ThemeToggle } from "./topnav/ThemeToggle";
import { NotificationButton } from "./topnav/NotificationButton";
import { UserProfile } from "./topnav/UserProfile";

interface TopNavProps { 
  toggleSidebar: () => void;
  collapsed: boolean;
  onLogout: () => void;
}

const TopNav = ({ toggleSidebar, collapsed, onLogout }: TopNavProps) => {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-sm flex items-center px-4 justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <SidebarToggle toggleSidebar={toggleSidebar} collapsed={collapsed} />
        <ShopBranding />
        
        <div className="hidden md:flex items-center ml-4">
          <SearchBar />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <NotificationButton />
        <UserProfile onLogout={onLogout} />
      </div>
    </header>
  );
};

export default TopNav;
