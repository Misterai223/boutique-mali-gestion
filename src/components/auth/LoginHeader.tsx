
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LoginHeader = () => {
  return (
    <CardHeader className="relative space-y-1 text-center pb-4">
      <motion.div 
        className="flex justify-center mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 shadow-lg flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
      </motion.div>
      
      <CardTitle className="text-2xl font-bold">Shop Manager</CardTitle>
      <CardDescription>
        Entrez vos identifiants pour accéder à votre boutique
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
