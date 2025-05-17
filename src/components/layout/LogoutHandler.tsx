
import { useState } from "react";
import { toast } from "sonner";

interface LogoutHandlerProps {
  onLogout: () => void;
}

export const LogoutHandler = ({ onLogout }: LogoutHandlerProps) => {
  const handleLogout = () => {
    toast.info("Déconnexion en cours...");
    setTimeout(() => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      onLogout();
    }, 500);
  };

  return { handleLogout };
};
