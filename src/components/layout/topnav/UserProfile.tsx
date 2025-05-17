
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/hooks/use-toast";
import { getCurrentUserProfile } from "@/services/users/userProfileService";
import { Profile } from "@/types/profile";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface UserProfileProps {
  onLogout: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { toast } = useToast();
  const { userRole, isAdmin } = useRolePermissions();
  
  useEffect(() => {
    // Load user profile
    const fetchUserProfile = async () => {
      setIsProfileLoading(true);
      try {
        const profile = await getCurrentUserProfile();
        console.log("Profil récupéré dans UserProfile:", profile);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const getUserInitials = () => {
    if (!userProfile?.full_name) return "U";
    
    return userProfile.full_name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Détermine le rôle affiché en fonction des droits effectifs
  const getDisplayRole = () => {
    if (isAdmin) {
      return "Administrateur";
    }
    
    if (userProfile?.role === "admin") {
      return "Administrateur";
    }
    
    return userProfile?.role === "employee" ? "Employé" : userProfile?.role || "Utilisateur";
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isProfileLoading ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full hover:bg-muted transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-start px-2"
          >
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col items-start">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-20 mt-1" />
            </div>
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full hover:bg-muted transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-start p-2"
          >
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={userProfile?.avatar_url || undefined} alt="Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-sm font-medium truncate max-w-[100px]">
                {userProfile?.full_name || "Utilisateur"}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                {getDisplayRole()}
              </span>
            </div>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
