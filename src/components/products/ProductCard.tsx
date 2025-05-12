
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Edit } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  const stockStatus = () => {
    if (product.stockQuantity <= 0) return "out-of-stock";
    if (product.stockQuantity < product.threshold) return "low-stock";
    return "in-stock";
  };

  const statusText = () => {
    const status = stockStatus();
    if (status === "out-of-stock") return "Rupture";
    if (status === "low-stock") return "Stock bas";
    return "En stock";
  };

  const statusVariant = () => {
    const status = stockStatus();
    if (status === "out-of-stock") return "destructive";
    if (status === "low-stock") return "outline";
    return "secondary";
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-square relative bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <span className="text-secondary-foreground">
              Pas d'image
            </span>
          </div>
        )}
        <Badge
          variant={statusVariant()}
          className="absolute top-2 right-2"
        >
          {statusText()}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div className="text-right">
            <div className="font-bold">{product.price.toLocaleString()} XOF</div>
            <div className="text-sm">Stock: {product.stockQuantity}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        <Button size="sm">Voir</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
