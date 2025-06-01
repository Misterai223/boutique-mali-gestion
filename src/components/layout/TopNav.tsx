
import { SidebarToggle } from "./topnav/SidebarToggle";
import { ShopBranding } from "./topnav/ShopBranding";
import { SearchBar } from "./topnav/SearchBar";
import { ThemeToggle } from "./topnav/ThemeToggle";
import { NotificationButton } from "./topnav/NotificationButton";
import { UserProfile } from "./topnav/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import RoleIndicator from "./RoleIndicator";

interface TopNavProps { 
  toggleSidebar: () => void;
  collapsed: boolean;
  onLogout: () => void;
}

const TopNav = ({ toggleSidebar, collapsed, onLogout }: TopNavProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-14 sm:h-16 border-b bg-background/95 backdrop-blur-xl flex items-center px-3 sm:px-4 lg:px-6 justify-between shadow-sm sticky top-0 z-50 border-border/50"
      style={{
        borderBottomColor: 'hsl(var(--primary) / 0.2)',
        boxShadow: '0 4px 6px -1px hsl(var(--primary) / 0.1), 0 2px 4px -2px hsl(var(--primary) / 0.1)'
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <SidebarToggle toggleSidebar={toggleSidebar} collapsed={collapsed} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="min-w-0"
        >
          <ShopBranding />
        </motion.div>
        
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="ml-2 lg:ml-4"
          >
            <RoleIndicator />
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {!isMobile && (
          <motion.div 
            className="flex items-center mr-2 lg:mr-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        )}
        
        <div className="flex items-center gap-1">
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mr-1"
            >
              <SearchBar />
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggle />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NotificationButton />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <UserProfile onLogout={onLogout} />
          </motion.div>
          
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="ml-1"
            >
              <RoleIndicator />
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default TopNav;
