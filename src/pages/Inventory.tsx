
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

// Sample inventory data
const inventoryItems = [
  { id: 1, name: "Téléviseur 4K", sku: "TV-4K-001", quantity: 15, threshold: 5, category: "Électronique" },
  { id: 2, name: "Laptop Ultra", sku: "LAP-U-002", quantity: 8, threshold: 3, category: "Informatique" },
  { id: 3, name: "Casque Bluetooth", sku: "AUDIO-BT-003", quantity: 32, threshold: 10, category: "Audio" },
  { id: 4, name: "Clavier Mécanique", sku: "KB-MECH-004", quantity: 2, threshold: 5, category: "Périphériques" },
  { id: 5, name: "Souris Gaming", sku: "MS-GAME-005", quantity: 0, threshold: 5, category: "Périphériques" },
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  const sortedItems = [...inventoryItems]
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      const compareA = a[sortBy as keyof typeof a];
      const compareB = b[sortBy as keyof typeof b];
      
      if (typeof compareA === 'string' && typeof compareB === 'string') {
        return sortOrder === "asc" 
          ? compareA.localeCompare(compareB) 
          : compareB.localeCompare(compareA);
      }
      
      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return sortOrder === "asc" ? compareA - compareB : compareB - compareA;
      }
      
      return 0;
    });
  
  const handleAddItem = () => {
    toast.success("Formulaire d'ajout de produit ouvert");
    // This would open a modal form in a real implementation
  };
  
  const handleUpdateStock = (id: number) => {
    toast.success(`Mise à jour du stock pour l'article #${id}`);
    // This would open a stock update form in a real implementation
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Gestion de Stock</h1>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>Gérez votre stock et suivez les niveaux d'inventaire</CardDescription>
          </div>
          <Button onClick={handleAddItem} className="animate-pulse hover:animate-none">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un article
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, SKU ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 py-2"
              />
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    Nom <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('sku')}
                  >
                    SKU <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 text-right"
                    onClick={() => handleSort('quantity')}
                  >
                    Quantité <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('category')}
                  >
                    Catégorie <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.quantity === 0 ? (
                          <Badge variant="destructive" className="animate-pulse">Rupture</Badge>
                        ) : item.quantity <= item.threshold ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">Faible</Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-500">En stock</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateStock(item.id)}
                        >
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Aucun résultat trouvé pour "{searchTerm}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
