
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

// Sample inventory data with proper typing
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  threshold: number;
  category: string;
}

const initialInventoryItems: InventoryItem[] = [
  { id: 1, name: "Téléviseur 4K", sku: "TV-4K-001", quantity: 15, threshold: 5, category: "Électronique" },
  { id: 2, name: "Laptop Ultra", sku: "LAP-U-002", quantity: 8, threshold: 3, category: "Informatique" },
  { id: 3, name: "Casque Bluetooth", sku: "AUDIO-BT-003", quantity: 32, threshold: 10, category: "Audio" },
  { id: 4, name: "Clavier Mécanique", sku: "KB-MECH-004", quantity: 2, threshold: 5, category: "Périphériques" },
  { id: 5, name: "Souris Gaming", sku: "MS-GAME-005", quantity: 0, threshold: 5, category: "Périphériques" },
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    sku: "",
    quantity: 0,
    threshold: 5,
    category: ""
  });
  
  const handleSort = (column: keyof InventoryItem) => {
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
      
      const compareA = a[sortBy];
      const compareB = b[sortBy];
      
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
    setIsAddItemModalOpen(true);
  };
  
  const handleUpdateStock = (item: InventoryItem) => {
    setCurrentItem(item);
    setNewQuantity(item.quantity);
    setIsStockModalOpen(true);
  };

  const handleSaveNewItem = () => {
    if (!newItem.name || !newItem.sku || !newItem.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newId = Math.max(...inventoryItems.map(item => item.id)) + 1;
    const itemToAdd = { 
      ...newItem, 
      id: newId 
    } as InventoryItem;
    
    setInventoryItems([...inventoryItems, itemToAdd]);
    setNewItem({
      name: "",
      sku: "",
      quantity: 0,
      threshold: 5,
      category: ""
    });
    
    setIsAddItemModalOpen(false);
    toast.success(`Article ${newItem.name} ajouté avec succès`);
  };

  const handleSaveStockUpdate = () => {
    if (!currentItem) return;
    
    const updatedItems = inventoryItems.map(item => 
      item.id === currentItem.id ? { ...item, quantity: newQuantity } : item
    );
    
    setInventoryItems(updatedItems);
    setIsStockModalOpen(false);
    toast.success(`Stock de ${currentItem.name} mis à jour à ${newQuantity} unités`);
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
          <Button onClick={handleAddItem} className="hover:bg-primary/90">
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
                          <Badge variant="destructive">Rupture</Badge>
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
                          onClick={() => handleUpdateStock(item)}
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

      {/* Modal pour mettre à jour le stock */}
      <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mettre à jour le stock</DialogTitle>
            <DialogDescription>
              {currentItem ? `Modifier la quantité en stock pour ${currentItem.name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantité
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                min={0}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveStockUpdate}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour ajouter un nouvel article */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouvel article à l'inventaire
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom*
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU*
              </Label>
              <Input
                id="sku"
                value={newItem.sku}
                onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Catégorie*
              </Label>
              <Input
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantité
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                min={0}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Seuil d'alerte
              </Label>
              <Input
                id="threshold"
                type="number"
                value={newItem.threshold}
                onChange={(e) => setNewItem({...newItem, threshold: Number(e.target.value)})}
                min={1}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveNewItem}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
