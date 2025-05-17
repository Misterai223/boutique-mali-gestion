
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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isForgotPasswordSubmitted, setIsForgotPasswordSubmitted] = useState(false);
  const navigate = useNavigate();

  // Vérification initiale de session
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const session = await authService.getSession();
        if (session) {
          console.log("Session existante trouvée, connexion automatique");
          // S'assurer que le profil utilisateur est également chargé
          await authService.getCurrentUser();
          onLogin();
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [onLogin]);

  // S'abonner aux changements d'état d'authentification
  useEffect(() => {
    const { data: { subscription } } = authService.subscribeToAuthChanges(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          console.log("Événement de connexion détecté");
          onLogin();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des entrées
    if (!email.trim()) {
      setErrorMsg("L'adresse email est requise");
      return;
    }
    
    if (!password) {
      setErrorMsg("Le mot de passe est requis");
      return;
    }
    
    // Réinitialiser l'état d'erreur et activer le chargement
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      console.log("Tentative de connexion avec:", email);
      
      // Utiliser simpleLogin pour une meilleure compatibilité
      const { data, error } = await authService.simpleLogin(email, password);
      
      if (error) {
        console.error("Erreur lors de la connexion:", error.message);
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }
      
      if (data?.session) {
        console.log("Session établie avec succès:", data.session.user.email);
        toast.success("Connexion réussie!");
        onLogin();
      } else {
        console.error("Session non établie malgré une réponse sans erreur");
        setErrorMsg("Impossible d'établir la session. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Exception non gérée lors de la connexion:", error);
      setErrorMsg(error.message || "Une erreur inattendue s'est produite");
      setIsLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMsg("Veuillez entrer votre email pour réinitialiser votre mot de passe");
      return;
    }
    
    setIsLoading(true);
    setForgotPasswordEmail(email);
    
    try {
      const success = await authService.resetPassword(email);
      if (success) {
        setIsForgotPasswordSubmitted(true);
        toast.success(`Instructions de récupération envoyées à ${email}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de récupération:", error);
      toast.error("Impossible d'envoyer l'email de récupération");
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    if (errorMsg) {
      setErrorMsg("");
    }
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
                    clearErrors();
                  }}
                />
                
                <PasswordInput
                  password={password}
                  setPassword={(value) => {
                    setPassword(value);
                    clearErrors();
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
