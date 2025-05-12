
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/products/ProductCard";
import ProductForm from "@/components/products/ProductForm";
import { Product } from "@/types/product";
import { Plus, Search } from "lucide-react";

// Sample data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 13",
    category: "Téléphones",
    price: 350000,
    stockQuantity: 15,
    threshold: 5,
    description: "Un smartphone haut de gamme avec d'excellentes performances",
    imageUrl: "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    category: "Téléphones",
    price: 280000,
    stockQuantity: 3,
    threshold: 5,
    description: "Un smartphone puissant avec un excellent appareil photo",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Écouteurs Bluetooth",
    category: "Accessoires",
    price: 25000,
    stockQuantity: 5,
    threshold: 10,
    description: "Écouteurs sans fil avec réduction de bruit",
    imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5e084?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Câble USB-C",
    category: "Accessoires",
    price: 5000,
    stockQuantity: 4,
    threshold: 20,
    description: "Câble de charge pour appareils USB-C",
    imageUrl: "https://images.unsplash.com/photo-1621370115429-cf6c8f4e0f54?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "iPad Pro",
    category: "Tablettes",
    price: 450000,
    stockQuantity: 0,
    threshold: 3,
    description: "Tablette professionnelle avec écran Liquid Retina",
    imageUrl: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "MacBook Air",
    category: "Ordinateurs",
    price: 650000,
    stockQuantity: 8,
    threshold: 2,
    description: "Ordinateur portable léger et puissant",
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
  },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEditProduct = (product: Product) => {
    if (currentProduct) {
      // Edit existing product
      setProducts(
        products.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      // Add new product
      setProducts([...products, product]);
    }
    setCurrentProduct(undefined);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un produit par nom ou catégorie..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun produit trouvé</p>
        </div>
      )}

      <ProductForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={currentProduct}
        onSave={handleAddEditProduct}
      />
    </div>
  );
};

export default Products;
