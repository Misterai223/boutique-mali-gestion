
import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopLogoProps {
  shopName: string;
  shopLogo: string | null;
  isCollapsed: boolean;
}

export function ShopLogo({ shopName, shopLogo, isCollapsed }: ShopLogoProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg border">
          {shopLogo ? (
            <img
              src={shopLogo}
              alt="Logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <Building className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <Link to="/" className="flex items-center gap-2 px-1">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg border">
          {shopLogo ? (
            <img
              src={shopLogo}
              alt="Logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <Building className="h-5 w-5" />
            </div>
          )}
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
