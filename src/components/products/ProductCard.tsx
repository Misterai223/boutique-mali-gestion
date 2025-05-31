
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductWithCategory } from "@/types/product";
import { Edit, Eye, Package, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ProductWithCategory;
  onEdit: (product: ProductWithCategory) => void;
  onView: (product: ProductWithCategory) => void;
}

const ProductCard = ({ product, onEdit, onView }: ProductCardProps) => {
  const stockStatus = () => {
    if (product.stock_quantity <= 0) return "out-of-stock";
    if (product.stock_quantity < product.threshold) return "low-stock";
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

  const statusIcon = () => {
    const status = stockStatus();
    if (status === "out-of-stock" || status === "low-stock") {
      return <AlertTriangle className="h-3 w-3 mr-1" />;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 border-primary/10">
      <div className="aspect-square relative bg-muted overflow-hidden">
        {product.image_url ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
            <Package className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
        <Badge
          variant={statusVariant()}
          className="absolute top-2 right-2 shadow-sm font-medium flex items-center"
        >
          {statusIcon()}
          {statusText()}
        </Badge>
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
            <Badge variant="outline" className="mt-1 font-normal text-xs">
              {product.category?.name || "Sans catégorie"}
            </Badge>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary">{formatPrice(product.price)} <span className="text-sm font-medium">XOF</span></div>
            <div className="text-xs mt-1 text-muted-foreground">
              Stock: {product.stock_quantity} unités
            </div>
          </div>
        </div>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t gap-2 grid grid-cols-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(product)}
          className="w-full text-sm font-medium transition-colors"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Modifier
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => onView(product)}
          className="w-full text-sm font-medium transition-colors"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Voir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
