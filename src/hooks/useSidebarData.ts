
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";

export function useSidebarData() {
  const [shopName, setShopName] = useState<string>("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Load saved shop name and logo
    const savedShopName = localStorage.getItem("shopName");
    const savedShopLogo = localStorage.getItem("shopLogo");
    
    setShopName(savedShopName || "Shop Manager");
    setShopLogo(savedShopLogo || null);
    
    // Get current user
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    fetchCurrentUser();
    
    // Setup a listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "shopName") {
        setShopName(e.newValue || "Shop Manager");
      } else if (e.key === "shopLogo") {
        setShopLogo(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for local changes (since storage event only fires in different tabs)
    const updateLocalStorage = () => {
      setShopName(localStorage.getItem("shopName") || "Shop Manager");
      setShopLogo(localStorage.getItem("shopLogo") || null);
    };
    
    document.addEventListener('localStorage.updated', updateLocalStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('localStorage.updated', updateLocalStorage);
    };
  }, []);

  return { shopName, shopLogo, currentUser };
}
