
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ClientSearchFilterProps {
  onSearch: (searchTerm: string) => void;
  count: number;
}

export default function ClientSearchFilter({ onSearch, count }: ClientSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(debouncedSearch);
  }, [searchTerm, onSearch]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {count} client{count !== 1 ? "s" : ""} trouvé{count !== 1 ? "s" : ""}
        </h2>
        
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-client">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-client"
                type="search"
                placeholder="Rechercher par nom, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Button type="submit" onClick={handleSearch}>
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
}
