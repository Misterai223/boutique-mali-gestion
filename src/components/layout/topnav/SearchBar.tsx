
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function SearchBar() {
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Sur mobile, la barre de recherche est cachée par défaut
  // et s'affiche en plein écran lorsqu'on clique sur l'icône
  if (isMobile && !isActive) {
    return (
      <button 
        onClick={() => setIsActive(true)}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-muted/40 text-muted-foreground"
        aria-label="Ouvrir la recherche"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }
  
  // Version active sur mobile (plein écran) ou version desktop
  return (
    <div className={`relative ${isMobile ? "fixed inset-0 z-50 p-4 bg-background/95 flex items-center" : "w-full max-w-xs lg:max-w-md"}`}>
      {isMobile && (
        <button
          onClick={() => setIsActive(false)}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-muted"
          aria-label="Fermer la recherche"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className={`relative ${isMobile ? "w-full" : ""}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          autoFocus={isMobile}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Rechercher..."
          className={`w-full pl-9 py-2 h-9 bg-muted/40 rounded-md focus:ring-2 focus:ring-primary/30 transition-all ${
            isMobile ? "text-base" : ""
          }`}
        />
        {searchValue && (
          <button 
            onClick={() => setSearchValue("")}
            className="absolute right-2.5 top-2.5 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
