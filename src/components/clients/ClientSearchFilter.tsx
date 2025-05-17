
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientSearchFilterProps {
  onSearch: (searchTerm: string) => void;
  count: number;
}

export default function ClientSearchFilter({ onSearch, count }: ClientSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const isMobile = useIsMobile();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    onSearch("");
  };
  
  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(debouncedSearch);
  }, [searchTerm, onSearch]);

  const containerAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      className="space-y-4"
    >
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Filter className="h-5 w-5 text-primary" />
          </motion.div>
          <h2 className="text-xl font-semibold">
            {count} client{count !== 1 ? "s" : ""} trouvé{count !== 1 ? "s" : ""}
          </h2>
        </div>
        
        <div className={`flex ${isMobile ? "flex-col space-y-2" : "items-end space-x-2"}`}>
          <div className="flex-grow">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="search-client" className="text-sm font-medium">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-client"
                  type="search"
                  placeholder="Rechercher par nom, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-muted"
                />
                {searchTerm && (
                  <button 
                    onClick={handleResetSearch} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className={`${isMobile ? "w-full" : "w-[180px]"}`}>
            <Label htmlFor="filter-type" className="text-sm font-medium">Filtrer par</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type" className="bg-background/50 backdrop-blur-sm border-muted">
                <SelectValue placeholder="Tous les clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                <SelectItem value="recent">Clients récents</SelectItem>
                <SelectItem value="country">Pays</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-shrink-0">
            <Label className="invisible text-sm font-medium">Action</Label>
            <Button 
              type="submit" 
              onClick={handleSearch}
              className="w-full md:w-auto shadow-sm hover:shadow-md transition-all"
            >
              <Search className="h-4 w-4 mr-2" /> 
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
