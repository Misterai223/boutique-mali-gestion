
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, ArrowUpDown, Package, XCircle, AlertCircle, CheckCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Sample inventory data with proper typing
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  threshold: number;
  category: string;
  description?: string;
  lastUpdated?: string;
}

const initialInventoryItems: InventoryItem[] = [
  { 
    id: 1, 
    name: "Téléviseur 4K", 
    sku: "TV-4K-001", 
    quantity: 15, 
    threshold: 5, 
    category: "Électronique", 
    description: "Smart TV 4K Ultra HD 55 pouces avec Android TV",
    lastUpdated: "2023-04-15" 
  },
  { 
    id: 2, 
    name: "Laptop Ultra", 
    sku: "LAP-U-002", 
    quantity: 8, 
    threshold: 3, 
    category: "Informatique",
    description: "Ordinateur portable 15.6\" avec processeur i7 et 16 Go RAM",
    lastUpdated: "2023-05-02"  
  },
  { 
    id: 3, 
    name: "Casque Bluetooth", 
    sku: "AUDIO-BT-003", 
    quantity: 32, 
    threshold: 10, 
    category: "Audio",
    description: "Casque sans fil avec réduction de bruit active",
    lastUpdated: "2023-05-10" 
  },
  { 
    id: 4, 
    name: "Clavier Mécanique", 
    sku: "KB-MECH-004", 
    quantity: 2, 
    threshold: 5, 
    category: "Périphériques",
    description: "Clavier mécanique gaming avec RGB",
    lastUpdated: "2023-04-28" 
  },
  { 
    id: 5, 
    name: "Souris Gaming", 
    sku: "MS-GAME-005", 
    quantity: 0, 
    threshold: 5, 
    category: "Périphériques",
    description: "Souris gaming 16000 DPI avec 8 boutons programmables",
    lastUpdated: "2023-04-20" 
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    sku: "",
    quantity: 0,
    threshold: 5,
    category: "",
    description: ""
  });
  
  // Extract unique categories for filtering
  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));

  // Statistics for dashboard cards
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventoryItems.filter(item => item.quantity > 0 && item.quantity <= item.threshold).length;
  const outOfStockCount = inventoryItems.filter(item => item.quantity === 0).length;
  
  const handleSort = (column: keyof InventoryItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Filter functions
  const filterByCategory = (item: InventoryItem) => {
    if (!activeCategory) return true;
    return item.category === activeCategory;
  };

  const filterBySearch = (item: InventoryItem) => {
    if (!searchTerm) return true;
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const sortedItems = [...inventoryItems]
    .filter(filterByCategory)
    .filter(filterBySearch)
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

  const handleViewDetails = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleSaveNewItem = () => {
    if (!newItem.name || !newItem.sku || !newItem.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newId = Math.max(...inventoryItems.map(item => item.id)) + 1;
    const itemToAdd = { 
      ...newItem, 
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0]
    } as InventoryItem;
    
    setInventoryItems([...inventoryItems, itemToAdd]);
    setNewItem({
      name: "",
      sku: "",
      quantity: 0,
      threshold: 5,
      category: "",
      description: ""
    });
    
    setIsAddItemModalOpen(false);
    toast.success(`Article ${newItem.name} ajouté avec succès`);
  };

  const handleSaveStockUpdate = () => {
    if (!currentItem) return;
    
    const updatedItems = inventoryItems.map(item => 
      item.id === currentItem.id ? 
      { 
        ...item, 
        quantity: newQuantity,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : item
    );
    
    setInventoryItems(updatedItems);
    setIsStockModalOpen(false);
    toast.success(`Stock de ${currentItem.name} mis à jour à ${newQuantity} unités`);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { status: "out", label: "Rupture", variant: "destructive", icon: <XCircle className="h-4 w-4 mr-1" /> };
    } else if (item.quantity <= item.threshold) {
      return { status: "low", label: "Stock bas", variant: "outline", icon: <AlertCircle className="h-4 w-4 mr-1" /> };
    }
    return { status: "in", label: "En stock", variant: "outline", icon: <CheckCircle className="h-4 w-4 mr-1" /> };
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Gestion de Stock</h1>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Inventaire Total</CardTitle>
                <CardDescription>Nombre total d'articles</CardDescription>
              </div>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalItems}</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Stock Bas</CardTitle>
                <CardDescription>Articles à réapprovisionner</CardDescription>
              </div>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{lowStockCount}</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Ruptures</CardTitle>
                <CardDescription>Articles en rupture de stock</CardDescription>
              </div>
              <XCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{outOfStockCount}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Inventaire</CardTitle>
              <CardDescription>Gérez votre stock et suivez les niveaux d'inventaire</CardDescription>
            </div>
            <Button 
              onClick={handleAddItem} 
              className="hover:bg-primary/90 shadow-sm flex gap-2 items-center transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Ajouter un article
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-auto md:flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher par nom, SKU ou catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 py-2"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Button 
                    variant={activeCategory === null ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveCategory(null)}
                    className="flex gap-1 items-center"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Tous
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="rounded-lg border overflow-hidden shadow-sm">
                <ScrollArea className="h-[calc(100vh-26rem)] w-full">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-1">
                            Nom <ArrowUpDown className="h-3.5 w-3.5 inline" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50 transition-colors hidden md:table-cell"
                          onClick={() => handleSort('sku')}
                        >
                          <div className="flex items-center gap-1">
                            SKU <ArrowUpDown className="h-3.5 w-3.5 inline" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                          onClick={() => handleSort('quantity')}
                        >
                          <div className="flex items-center gap-1 justify-end">
                            Quantité <ArrowUpDown className="h-3.5 w-3.5 inline" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50 transition-colors hidden md:table-cell"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center gap-1">
                            Catégorie <ArrowUpDown className="h-3.5 w-3.5 inline" />
                          </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedItems.length > 0 ? (
                        sortedItems.map((item) => {
                          const stockStatus = getStockStatus(item);
                          return (
                            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors group">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="line-clamp-1">{item.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{item.sku}</TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge 
                                  variant={stockStatus.status === "out" ? "destructive" : "outline"}
                                  className={`flex items-center w-fit ${
                                    stockStatus.status === "low" 
                                      ? "border-amber-500 text-amber-500" 
                                      : stockStatus.status === "in"
                                        ? "border-emerald-500 text-emerald-500"
                                        : ""
                                  }`}
                                >
                                  {stockStatus.icon}
                                  {stockStatus.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewDetails(item)}
                                    className="hidden sm:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Détails
                                  </Button>
                                  <Button 
                                    variant={stockStatus.status === "out" ? "destructive" : "default"} 
                                    size="sm"
                                    onClick={() => handleUpdateStock(item)}
                                    className="transition-transform hover:scale-105 active:scale-95"
                                  >
                                    Modifier
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            Aucun résultat trouvé pour "{searchTerm}"
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
            <Button onClick={handleSaveStockUpdate} className="bg-primary hover:bg-primary/90">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour ajouter un nouvel article */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouvel article à l'inventaire
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-4 py-4 px-1">
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newItem.description || ""}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  rows={4}
                  className="col-span-3"
                  placeholder="Description détaillée du produit..."
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveNewItem}
              className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour voir les détails d'un article */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Détails de l'Article</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-right">Nom:</div>
                <div className="col-span-2">{currentItem.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-right">SKU:</div>
                <div className="col-span-2">{currentItem.sku}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-right">Catégorie:</div>
                <div className="col-span-2">{currentItem.category}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-right">Quantité:</div>
                <div className="col-span-2">{currentItem.quantity}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-right">Seuil d'alerte:</div>
                <div className="col-span-2">{currentItem.threshold}</div>
              </div>
              {currentItem.description && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">Description:</div>
                  <div className="col-span-2">{currentItem.description}</div>
                </div>
              )}
              {currentItem.lastUpdated && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-right">Dernière mise à jour:</div>
                  <div className="col-span-2">{currentItem.lastUpdated}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-right">Statut:</div>
                <div className="col-span-2">
                  <Badge 
                    variant={getStockStatus(currentItem).status === "out" ? "destructive" : "outline"}
                    className={`flex items-center w-fit ${
                      getStockStatus(currentItem).status === "low" 
                        ? "border-amber-500 text-amber-500" 
                        : getStockStatus(currentItem).status === "in"
                          ? "border-emerald-500 text-emerald-500"
                          : ""
                    }`}
                  >
                    {getStockStatus(currentItem).icon}
                    {getStockStatus(currentItem).label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Inventory;
