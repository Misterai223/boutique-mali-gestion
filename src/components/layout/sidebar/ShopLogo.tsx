
import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ShopLogoProps {
  shopName: string;
  shopLogo: string | null;
  isCollapsed: boolean;
}

export function ShopLogo({ shopName, shopLogo, isCollapsed }: ShopLogoProps) {
  const [imageError, setImageError] = useState(false);
  
  // Reset error state when logo URL changes
  useEffect(() => {
    setImageError(false);
  }, [shopLogo]);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderLogoImage = () => {
    if (!shopLogo || imageError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          <Building className="h-5 w-5" />
        </div>
      );
    }

    return (
      <img
        src={shopLogo}
        alt="Logo"
        className="h-full w-full object-contain"
        onError={handleImageError}
      />
    );
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg border">
          {renderLogoImage()}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <Link to="/" className="flex items-center gap-2 px-1">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg border">
          {renderLogoImage()}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
            {shopName}
          </span>
          <span className="text-xs text-muted-foreground">Gestion commerciale</span>
        </div>
      </Link>
    </div>
  );
}
