
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, KeyRound, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
              .filter(file => !file.id.endsWith('/'))
              .sort((a, b) => {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full overflow-hidden shadow-2xl border-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 opacity-50" />
          
          <CardHeader className="relative space-y-1 text-center pb-6 pt-8">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              {logoUrl ? (
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 shadow-lg flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
            </motion.div>
            
            <CardTitle className="text-3xl font-bold tracking-tight">Shop Manager</CardTitle>
            <CardDescription className="text-base">
              Entrez vos identifiants pour accéder à votre boutique
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative space-y-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div 
                className="space-y-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Mot de passe oublié?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Votre mot de passe"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pl-10 pr-10 py-6"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Button 
                  type="submit" 
                  className="w-full py-6 text-base font-semibold shadow-lg group transition-all duration-300 hover:shadow-primary/20" 
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
                      <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      Se connecter
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="relative flex flex-col space-y-4 border-t pt-6 pb-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm text-center text-muted-foreground"
            >
              <span>Pas encore de compte? </span>
              <span className="font-medium text-muted-foreground">
                Contactez votre administrateur
              </span>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;
