
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ShopBranding() {
  const [shopName, setShopName] = useState<string>("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load saved shop name and logo
    const savedShopName = localStorage.getItem("shopName");
    const savedShopLogo = localStorage.getItem("shopLogo");
    
    setShopName(savedShopName || "Shop Manager");
    setShopLogo(savedShopLogo || null);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      {shopLogo ? (
        <img 
          src={shopLogo} 
          alt="Logo" 
          className="h-8 w-auto object-contain"
          onError={() => {
            toast({
              title: "Erreur de chargement du logo",
              description: "Impossible de charger l'image du logo",
              variant: "destructive"
            });
            setShopLogo(null);
          }} 
        />
      ) : (
        <Building className="h-6 w-6 text-primary" />
      )}
      <Link to="/" className="text-lg font-medium hover:text-primary/80 transition-colors hidden sm:block">
        {shopName}
      </Link>
    </div>
  );
}
