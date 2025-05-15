
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, KeyRound, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Vérifier s'il existe un logo enregistré
  useEffect(() => {
    const storedLogo = localStorage.getItem("shopLogo");
    if (storedLogo) {
      setLogoUrl(storedLogo);
    } else {
      // Essayer de récupérer un logo depuis Supabase
      const fetchLogo = async () => {
        try {
          const logos = await supabase.storage.from('logos').list();
          if (logos.data && logos.data.length > 0) {
            const latestLogo = logos.data
              .filter(file => !file.id.endsWith('/')) // Filtrer les dossiers
              .sort((a, b) => {
                // Trier par date de création (du plus récent au plus ancien)
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })[0];
            
            if (latestLogo) {
              const { data } = supabase.storage.from('logos').getPublicUrl(latestLogo.name);
              setLogoUrl(data.publicUrl);
              localStorage.setItem("shopLogo", data.publicUrl);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du logo:", error);
        }
      };
      
      fetchLogo();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await authService.login(email, password);
      
      if (success) {
        toast.success("Connexion réussie");
        
        // Vérifier le rôle de l'utilisateur
        const profile = await userService.getCurrentUserProfile();
        if (profile) {
          localStorage.setItem("userRole", profile.role);
        }
        
        localStorage.setItem("isAuthenticated", "true");
        onLogin();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 sm:px-6 md:px-8 max-w-3xl mx-auto"
    >
      <Card className="w-full shadow-xl border-2 border-primary/10 bg-gradient-to-br from-card to-secondary/30">
        <CardHeader className="space-y-2 pb-6">
          <motion.div 
            className="flex justify-center mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            {logoUrl ? (
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CardTitle className="text-3xl font-bold text-center tracking-tight">Shop Manager</CardTitle>
            <CardDescription className="text-center text-base mt-2">
              Entrez vos identifiants pour accéder à votre boutique
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  placeholder="nom@exemple.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 py-6"
                />
              </div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <KeyRound className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  placeholder="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 py-6"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button 
                type="submit" 
                className="w-full py-6 text-base font-semibold shadow-lg group" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Se connecter
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <CardFooter className="flex flex-col space-y-2 border-t pt-4">
            <div className="text-sm text-center text-muted-foreground">
              <span>Pas encore de compte ? </span>
              <span className="font-medium text-muted-foreground">
                Contactez votre administrateur
              </span>
            </div>
          </CardFooter>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default LoginForm;

