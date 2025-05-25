
import { motion } from "framer-motion";
import { Building, Shield, Sparkles } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const LoginHeader = () => {
  const [shopName, setShopName] = useState<string>("");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    const savedShopName = localStorage.getItem("shopName");
    const savedShopLogo = localStorage.getItem("shopLogo");
    
    setShopName(savedShopName || "Shop Manager");
    if (savedShopLogo) {
      setShopLogo(savedShopLogo);
      setImageError(false);
    } else {
      setShopLogo(null);
    }
  }, []);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <CardHeader className="text-center pb-6 relative overflow-hidden">
      {/* Header background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 space-y-6">
        {/* Logo section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "backOut",
            type: "spring",
            stiffness: 200 
          }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(var(--primary-rgb), 0.2)",
                  "0 0 40px rgba(var(--primary-rgb), 0.4)", 
                  "0 0 20px rgba(var(--primary-rgb), 0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl border-2 border-primary/20 overflow-hidden bg-gradient-to-br from-background to-muted/50 flex items-center justify-center relative"
            >
              {shopLogo && !imageError ? (
                <img 
                  src={shopLogo} 
                  alt="Logo" 
                  className="w-full h-full object-contain p-2"
                  onError={handleImageError} 
                />
              ) : (
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-primary"
                >
                  <Building className="h-10 w-10" />
                </motion.div>
              )}
              
              {/* Sparkle effects */}
              <motion.div
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 0.5 
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-4 w-4 text-accent" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Title section */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
              {shopName}
            </CardTitle>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-foreground">
              Connexion
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Shield className="h-4 w-4 text-green-600" />
              </motion.div>
              <span>Accès sécurisé à votre espace</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-8"
        />
      </div>
    </CardHeader>
  );
};

export default LoginHeader;
