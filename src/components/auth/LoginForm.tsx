
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import LoginHeader from "./LoginHeader";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";
import LoginError from "./LoginError";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const session = await authService.getSession();
      if (session) {
        onLogin();
      }
    };
    checkExistingSession();
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMsg("Veuillez remplir tous les champs");
      return;
    }
    
    // Reset state before attempting login
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      const { data, error } = await authService.simpleLogin(email, password);
      
      if (error) {
        console.error("Erreur de connexion:", error.message);
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }
      
      if (data?.session) {
        // We have a valid session, proceed with login
        toast.success("Connexion réussie!");
        onLogin();
      } else {
        // This should rarely happen - we have data but no session
        setErrorMsg("Session non établie. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Exception lors de la connexion:", error);
      setErrorMsg(error.message || "Une erreur inattendue s'est produite");
      setIsLoading(false);
    }
  };

  // Handle password recovery - can be expanded in the future
  const handlePasswordRecovery = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Fonctionnalité de récupération de mot de passe à venir");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-primary/10 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
          
          <LoginHeader />
          
          <CardContent className="relative space-y-4">
            <LoginError errorMsg={errorMsg} />
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div 
                className="space-y-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <EmailInput 
                  email={email}
                  setEmail={(value) => {
                    setEmail(value);
                    setErrorMsg(""); // Clear errors when input changes
                  }}
                />
                
                <PasswordInput
                  password={password}
                  setPassword={(value) => {
                    setPassword(value);
                    setErrorMsg(""); // Clear errors when input changes
                  }}
                  onForgotPassword={handlePasswordRecovery}
                />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <LoginButton isLoading={isLoading} />
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 border-t pt-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm text-center text-muted-foreground"
            >
              <span>Pas encore de compte? </span>
              <span className="font-medium text-primary">
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
