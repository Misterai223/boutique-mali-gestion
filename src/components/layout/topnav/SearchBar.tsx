
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

export function SearchBar() {
  const isMobile = useIsMobile();
  
  return (
    <div className={`relative ${isMobile ? "w-full" : "w-64"}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Rechercher..."
        className="w-full pl-9 py-2 h-9 bg-muted/40 rounded-md focus:ring-2 focus:ring-primary/30 transition-all"
      />
    </div>
  );
}
