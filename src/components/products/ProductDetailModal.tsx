
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductWithCategory } from "@/types/product";
import { 
  Package, 
  Tag, 
  DollarSign, 
  Archive, 
  AlertTriangle,
  Edit,
  X,
  Calendar,
  Barcode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailModalProps {
  product: ProductWithCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: ProductWithCategory) => void;
}

const ProductDetailModal = ({ 
  product, 
  open, 
  onOpenChange, 
  onEdit 
}: ProductDetailModalProps) => {
  if (!product) return null;

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
      return <AlertTriangle className="h-4 w-4 mr-2" />;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-xl font-semibold">
                    Détails du produit
                  </DialogTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Image and basic info */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/2">
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                      {product.image_url ? (
                        <motion.img
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                          <Package className="h-20 w-20 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:w-1/2 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {product.name}
                      </h2>
                      <Badge
                        variant={statusVariant()}
                        className="mb-4 font-medium flex items-center w-fit"
                      >
                        {statusIcon()}
                        {statusText()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-muted-foreground">Prix</span>
                        </div>
                        <p className="text-xl font-bold text-green-600">
                          {formatPrice(product.price)} <span className="text-sm">XOF</span>
                        </p>
                      </div>

                      <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Archive className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-muted-foreground">Stock</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">
                          {product.stock_quantity} <span className="text-sm">unités</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-muted-foreground">Catégorie</span>
                      </div>
                      <Badge variant="outline" className="font-normal">
                        {product.category?.name || "Sans catégorie"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations détaillées</h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Barcode className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">ID Produit</span>
                      </div>
                      <span className="text-muted-foreground font-mono text-sm">#{product.id}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Seuil d'alerte</span>
                      </div>
                      <span className="text-orange-600 font-semibold">{product.threshold} unités</span>
                    </div>

                    {product.description && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Description</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6 bg-muted/20">
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onEdit(product);
                    onOpenChange(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le produit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ProductDetailModal;
