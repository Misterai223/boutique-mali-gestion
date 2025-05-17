
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ShopBranding() {
  const [shopName, setShopName] = useState<string>("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load saved shop name and logo
    const updateLocalData = () => {
      const savedShopName = localStorage.getItem("shopName");
      const savedShopLogo = localStorage.getItem("shopLogo");
      
      setShopName(savedShopName || "Shop Manager");
      if (savedShopLogo) {
        setShopLogo(savedShopLogo);
        setImageError(false);  // Reset error state when URL changes
      } else {
        setShopLogo(null);
      }
    };
    
    // Initial load
    updateLocalData();
    
    // Setup event listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "shopName") {
        setShopName(e.newValue || "Shop Manager");
      } else if (e.key === "shopLogo") {
        if (e.newValue) {
          setShopLogo(e.newValue);
          setImageError(false);  // Reset error state
        } else {
          setShopLogo(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('localStorage.updated', updateLocalData);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('localStorage.updated', updateLocalData);
    };
  }, []);
  
  const handleImageError = () => {
    setImageError(true);
    toast({
      title: "Erreur de chargement du logo",
      description: "Impossible de charger l'image du logo",
      variant: "destructive"
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 overflow-hidden rounded-md border flex-shrink-0">
        {shopLogo && !imageError ? (
          <img 
            src={shopLogo} 
            alt="Logo" 
            className="h-full w-full object-contain"
            onError={handleImageError} 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-primary">
            <Building className="h-5 w-5" />
          </div>
        )}
      </div>
      <Link to="/" className="text-lg font-medium hover:text-primary/80 transition-colors hidden sm:block truncate max-w-[200px]">
        {shopName}
      </Link>
    </div>
  );
}
