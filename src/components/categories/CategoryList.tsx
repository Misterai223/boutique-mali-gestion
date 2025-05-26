
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Tag, Layers, TrendingUp, Eye } from "lucide-react";
import { Category } from "@/types/category";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      onDelete(categoryToDelete);
      setCategoryToDelete(null);
    }
    setIsDialogOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { 
      x: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  if (categories.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-20 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.div 
          className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-full p-8 mb-6 backdrop-blur-sm border border-primary/20"
          initial={{ scale: 0.5, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.25)"
          }}
        >
          <Tag className="h-12 w-12 text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
        <motion.h3 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Aucune catégorie
        </motion.h3>
        <motion.p 
          className="text-muted-foreground max-w-md mt-3 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Vous n'avez pas encore créé de catégories. Commencez par ajouter une nouvelle catégorie pour organiser vos produits.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {categories.map((category, index) => (
          <motion.div 
            key={category.id} 
            variants={cardVariants}
            layout
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              rotateY: 2,
              transition: { duration: 0.3, type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard(category.id)}
            onHoverEnd={() => setHoveredCard(null)}
            className="group perspective-1000"
          >
            <Card className="h-full relative overflow-hidden border border-border/50 bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
                animate={hoveredCard === category.id ? { opacity: 1 } : { opacity: 0 }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                variants={shimmerVariants}
                initial="initial"
                animate={hoveredCard === category.id ? "animate" : "initial"}
              />
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 font-semibold">
                        {category.name}
                      </CardTitle>
                    </motion.div>
                    <CardDescription className="mt-2">
                      <motion.div 
                        className="flex items-center text-sm"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <Tag className="h-3.5 w-3.5 mr-2 text-primary/60" />
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">
                          {category.slug}
                        </span>
                      </motion.div>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(category)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => confirmDelete(category.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4 relative z-10">
                <motion.p 
                  className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {category.description || "Aucune description disponible"}
                </motion.p>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-border/30 bg-muted/20 relative z-10">
                <div className="flex items-center justify-between w-full">
                  <motion.div 
                    className="flex items-center text-muted-foreground"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Layers className="h-4 w-4 mr-2 text-primary/60" />
                    <span className="text-sm font-medium">
                      {category.productCount || 0} 
                      <span className="ml-1 text-xs">produits</span>
                    </span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs px-3 h-7 rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 font-medium"
                      onClick={() => onEdit(category)}
                    >
                      <Eye className="h-3 w-3 mr-1.5" />
                      Voir
                    </Button>
                  </motion.div>
                </div>
              </CardFooter>
              
              {/* Progress indicator */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary"
                initial={{ width: "0%" }}
                animate={{ width: hoveredCard === category.id ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px] border border-border/50 bg-background/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Cette action est irréversible. Cela supprimera définitivement cette catégorie et pourrait affecter les produits associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default CategoryList;
